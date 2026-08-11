import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createUIMessageStreamResponse } from "ai"

import { assistantLimits } from "@/lib/assistant/limits"
import { assembleMessages, estimateTokens, parseAssistantRequest } from "@/lib/assistant/messages"
import { checkRateLimit, hashIp } from "@/lib/assistant/rate-limit"
import { streamAssistant } from "@/lib/assistant/run"
import { buildSystemPrompt } from "@/lib/assistant/system-instruction"
import { getServerConfig } from "@/lib/env"

/**
 * `POST /api/assistant` — the assistant backend boundary.
 *
 * Runs on the Node.js runtime (the rate limiter uses `node:crypto`, and the
 * server-only context/curated Q&A must never ship to the client). `maxDuration`
 * bounds runaway invocations; the provider call is separately aborted at the
 * frozen timeout.
 *
 * Order of operations, all before the model is ever called:
 *   1. config gate     — missing key → 503 offline (never a 500 crash)
 *   2. body validation  — bad shape → 400, over-cap question → 413
 *   3. rate limiting    — exhausted window → 429 degraded
 * Only then is the frozen prompt assembled and streamed.
 */
export const runtime = "nodejs"
export const maxDuration = 15

function jsonResponse(body: unknown, status: number, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  })
}

/** Best-effort client IP from proxy headers; hashed by the caller, never stored raw. */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded)
    return forwarded.split(",")[0]?.trim() || "unknown"
  return request.headers.get("x-real-ip")?.trim() || "unknown"
}

/** Stable anonymous session id supplied by the client, if any. */
function sessionId(request: Request): string | undefined {
  const raw = request.headers.get("x-assistant-session")?.trim()
  if (!raw)
    return undefined
  return raw.slice(0, 128)
}

export async function POST(request: Request): Promise<Response> {
  // 1. Config gate — a missing secret is an offline transport state, not a crash.
  const config = getServerConfig()
  if (!config.ok)
    return jsonResponse({ status: "offline", reason: "missing_config" }, 503)

  // 2. Validate the request body.
  let raw: unknown
  try {
    raw = await request.json()
  }
  catch {
    return jsonResponse({ status: "error", error: "Invalid JSON body." }, 400)
  }

  const parsed = parseAssistantRequest(raw)
  if (!parsed.ok)
    return jsonResponse({ status: "error", error: parsed.error }, parsed.status)

  // 3. Rate limit before any model call.
  const decision = checkRateLimit({
    sessionId: sessionId(request),
    ipHash: hashIp(clientIp(request)),
  })
  if (!decision.allowed) {
    return jsonResponse(
      { status: "degraded", reason: "rate_limited", scope: decision.scope },
      429,
      { "retry-after": String(decision.retryAfterSeconds) },
    )
  }

  // 4. Assemble the frozen message order and stream the answer.
  const system = buildSystemPrompt()
  const messages = assembleMessages(parsed.turns, estimateTokens(system))

  const google = createGoogleGenerativeAI({ apiKey: config.apiKey })
  const signal = AbortSignal.any([
    request.signal,
    AbortSignal.timeout(assistantLimits.providerTimeoutMs),
  ])

  const stream = streamAssistant({
    model: google(config.model),
    system,
    messages,
    signal,
  })

  return createUIMessageStreamResponse({ stream })
}
