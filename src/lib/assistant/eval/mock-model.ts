import type { LanguageModel } from "ai"
import { convertArrayToReadableStream, MockLanguageModelV4 } from "ai/test"

/**
 * Provider-level stream helpers for the evaluation gate (I6).
 *
 * The gate drives the *real* assistant pipeline (`streamAssistant` → meta strip
 * → message metadata) but swaps the Gemini call for a scripted model, so the
 * suite runs keyless in CI. Each scripted model replays a fixed raw transcript —
 * exactly the bytes a compliant model would emit, control line first — through
 * the same stream machinery the live route uses.
 *
 * The provider stream-part type is derived from `MockLanguageModelV4` itself
 * (`@ai-sdk/provider` is not a direct dependency), so the parts we build stay
 * type-checked against the installed AI SDK without an extra import.
 */
type StreamResult = Awaited<ReturnType<MockLanguageModelV4["doStream"]>>
type StreamPart = StreamResult["stream"] extends ReadableStream<infer P> ? P : never
type FinishStreamPart = Extract<StreamPart, { type: "finish" }>

/**
 * No token counts — the eval never asserts on usage, and the provider type
 * allows every field to be `undefined`.
 */
const NO_USAGE = {
  inputTokens: { total: undefined, noCache: undefined, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: undefined, text: undefined, reasoning: undefined },
} as const

const FINISH_PART: FinishStreamPart = {
  type: "finish",
  finishReason: { unified: "stop", raw: "stop" },
  usage: NO_USAGE,
}

/**
 * Splits text into up to `count` non-empty pieces so the transcript arrives as
 * several `text-delta` chunks. This deliberately fragments the leading control
 * line across chunk boundaries, exercising the buffer-until-newline path in
 * `metaStripper` rather than handing it the whole line in one delta.
 */
function chunk(text: string, count: number): string[] {
  if (text.length === 0)
    return [""]
  const size = Math.max(1, Math.ceil(text.length / count))
  const pieces: string[] = []
  for (let i = 0; i < text.length; i += size)
    pieces.push(text.slice(i, i + size))
  return pieces
}

/**
 * Builds a `LanguageModel` that streams a fixed raw transcript — the model's
 * verbatim output including the leading `⟦meta …⟧` control line. Feed it to
 * `streamAssistant` to assert on the parsed disposition/sources and the clean
 * answer without contacting a provider.
 */
export function createScriptedModel(rawOutput: string): LanguageModel {
  const parts: StreamPart[] = [
    { type: "stream-start", warnings: [] },
    { type: "text-start", id: "0" },
    ...chunk(rawOutput, 3).map((delta): StreamPart => ({ type: "text-delta", id: "0", delta })),
    { type: "text-end", id: "0" },
    FINISH_PART,
  ]

  return new MockLanguageModelV4({
    doStream: async () => ({ stream: convertArrayToReadableStream(parts) }),
  })
}

/**
 * Builds a `LanguageModel` whose stream fails immediately, standing in for a
 * provider outage or quota error. The pipeline must mask this to an `offline`
 * transport state with no fabricated answer — never surface the error text.
 */
export function createFailingModel(): LanguageModel {
  const parts: StreamPart[] = [
    { type: "stream-start", warnings: [] },
    { type: "error", error: new Error("simulated provider failure") },
  ]

  return new MockLanguageModelV4({
    doStream: async () => ({ stream: convertArrayToReadableStream(parts) }),
  })
}
