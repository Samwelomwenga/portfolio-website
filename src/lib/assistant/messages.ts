import type { ModelMessage } from "ai"

import { assistantLimits } from "@/lib/assistant/limits"

/**
 * Request parsing and message assembly for the assistant route.
 *
 * Kept pure (no `server-only`, no provider imports) so the eval suite (I6) can
 * exercise validation and the frozen assembly order without a running model.
 */

/** One turn of the session transcript as received from the client. */
export type ConversationTurn = {
  role: "user" | "assistant"
  content: string
}

export type ParsedRequest
  = | { ok: true, turns: ConversationTurn[] }
    | { ok: false, status: number, error: string }

const ROLES: ReadonlySet<string> = new Set(["user", "assistant"])

/** Rough token estimate (~4 chars/token) — enough to police the input budget. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Validates the request body into a conversation transcript.
 *
 * Enforces the two hard input rules that hold regardless of rate-limit storage:
 * the body must be a non-empty `messages` array of `{ role, content }` turns
 * ending in a visitor question, and that question must be within the frozen
 * prompt character cap (over-cap → HTTP 413, before any model call).
 */
export function parseAssistantRequest(raw: unknown): ParsedRequest {
  if (typeof raw !== "object" || raw === null || !("messages" in raw))
    return { ok: false, status: 400, error: "Expected a JSON body with a messages array." }

  const { messages } = raw as { messages: unknown }
  if (!Array.isArray(messages) || messages.length === 0)
    return { ok: false, status: 400, error: "messages must be a non-empty array." }

  const turns: ConversationTurn[] = []
  for (const item of messages) {
    if (typeof item !== "object" || item === null)
      return { ok: false, status: 400, error: "Each message must be an object." }

    const { role, content } = item as { role?: unknown, content?: unknown }
    if (typeof role !== "string" || !ROLES.has(role))
      return { ok: false, status: 400, error: "Each message needs a role of \"user\" or \"assistant\"." }
    if (typeof content !== "string" || content.trim() === "")
      return { ok: false, status: 400, error: "Each message needs non-empty string content." }

    turns.push({ role: role as ConversationTurn["role"], content })
  }

  const latest = turns.at(-1)
  if (!latest)
    return { ok: false, status: 400, error: "messages must be a non-empty array." }
  if (latest.role !== "user")
    return { ok: false, status: 400, error: "The last message must be the visitor's question." }
  if (latest.content.length > assistantLimits.promptCharCap)
    return { ok: false, status: 413, error: `Question exceeds the ${assistantLimits.promptCharCap}-character limit.` }

  return { ok: true, turns }
}

/**
 * Assembles the volatile tail of the frozen message order (§A): prior turns
 * oldest→newest, then the latest visitor question last. The stable head (system
 * instruction + portfolio context) is supplied separately as the `system`
 * prompt, so callers pass its estimated token cost as `reservedTokens`.
 *
 * The latest question is always kept; older turns are dropped oldest-first
 * until the transcript fits the remaining input-token budget, so a long session
 * degrades by forgetting its earliest turns rather than by rejecting the ask.
 */
export function assembleMessages(turns: ConversationTurn[], reservedTokens: number): ModelMessage[] {
  const budget = assistantLimits.promptInputTokenBudget - reservedTokens
  const latest = turns.at(-1)
  if (!latest)
    return []
  const older = turns.slice(0, -1)

  let used = estimateTokens(latest.content)
  const kept: ConversationTurn[] = []
  for (let i = older.length - 1; i >= 0; i--) {
    const turn = older[i]
    if (!turn)
      continue
    const cost = estimateTokens(turn.content)
    if (used + cost > budget)
      break
    used += cost
    kept.unshift(turn)
  }

  return [...kept, latest].map(turn => ({ role: turn.role, content: turn.content }))
}
