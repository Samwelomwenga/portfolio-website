import type {
  InferUIMessageChunk,
  LanguageModel,
  ModelMessage,
  StreamTextTransform,
  TextStreamPart,
  ToolSet,
  UIMessage,
} from "ai"

import type { AssistantMeta } from "@/lib/assistant/meta"
import { streamText, toUIMessageStream } from "ai"

import { parseMetaLine } from "@/lib/assistant/meta"
import "server-only"

/** Message metadata surfaced to the client alongside the clean prose stream. */
export type AssistantMessageMetadata = AssistantMeta

export type AssistantUIMessage = UIMessage<AssistantMessageMetadata>

export type StreamAssistantOptions = {
  model: LanguageModel
  system: string
  messages: ModelMessage[]
  signal?: AbortSignal
}

/**
 * Output cap for the answer. Answers are 1–4 sentences by contract, so a tight
 * cap keeps latency and free-tier usage down. Kept local (not in the frozen I3
 * limits module) since it is a model-call detail, not a rate-limit guardrail.
 */
const MAX_OUTPUT_TOKENS = 800

/**
 * Raised when the model's output does not begin with a valid control line.
 * Enqueued as a stream error part (not thrown) so it is masked to `"offline"`
 * by `onError` rather than rejecting the whole stream — a missing control line
 * means we cannot trust the answer's grounding, so we degrade instead of
 * guessing a disposition or leaking the unparsed text.
 */
class AssistantContractError extends Error {}

const CONTRACT_ERROR = new AssistantContractError("assistant response is missing a valid control line")

/**
 * A stream transform that consumes the model's leading `⟦meta …⟧` control line:
 * it buffers text deltas until the first newline, parses the line into
 * `metaRef`, strips it from the visible stream, and forwards everything after
 * it untouched. All non-text parts pass through. A missing/invalid control line
 * emits an error part and suppresses all further output.
 */
function metaStripper(metaRef: { value: AssistantMeta | null }): StreamTextTransform<ToolSet> {
  return () => {
    let buffer = ""
    let metaDone = false
    let errored = false

    return new TransformStream<TextStreamPart<ToolSet>, TextStreamPart<ToolSet>>({
      transform(part, controller) {
        if (errored) {
          // Contract already failed: suppress further answer text, but let
          // structural/terminal parts (e.g. `finish`) through so the stream
          // still closes cleanly.
          if (part.type !== "text-delta")
            controller.enqueue(part)
          return
        }
        if (metaDone || part.type !== "text-delta") {
          controller.enqueue(part)
          return
        }

        buffer += part.text
        const newline = buffer.indexOf("\n")
        if (newline === -1)
          return // still accumulating the control line — emit nothing yet

        const meta = parseMetaLine(buffer.slice(0, newline))
        if (!meta) {
          errored = true
          controller.enqueue({ type: "error", error: CONTRACT_ERROR })
          return
        }

        metaRef.value = meta
        metaDone = true
        const rest = buffer.slice(newline + 1)
        buffer = ""
        if (rest)
          controller.enqueue({ ...part, text: rest })
      },
      flush(controller) {
        if (errored || metaDone)
          return
        // The stream ended before a newline: the whole output was the control
        // line with no answer body. Parse it so metadata is still surfaced.
        const meta = parseMetaLine(buffer)
        if (!meta) {
          controller.enqueue({ type: "error", error: CONTRACT_ERROR })
          return
        }
        metaRef.value = meta
      },
    })
  }
}

/**
 * Runs the assistant model call and returns a UI message stream carrying a clean
 * prose answer plus the parsed `disposition`/`sourceIds` as message metadata.
 *
 * The frozen system prompt and assembled turns are passed straight to
 * `streamText`; the leading control line is stripped in-stream (never reaching
 * the client as text) and re-attached on the finish chunk. Any provider or
 * contract failure resolves to a masked `"offline"` error chunk — never a
 * fabricated answer, never leaked internals.
 *
 * The `model` is injected so the eval suite (I6) can drive this with a mock.
 */
export function streamAssistant(
  options: StreamAssistantOptions,
): ReadableStream<InferUIMessageChunk<AssistantUIMessage>> {
  const metaRef: { value: AssistantMeta | null } = { value: null }

  const result = streamText({
    model: options.model,
    system: options.system,
    messages: options.messages,
    abortSignal: options.signal,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    temperature: 0.3,
    experimental_transform: metaStripper(metaRef),
    // Handle provider/abort failures here so the result's error promises are
    // settled (no unhandled rejection). Log for server observability; the
    // client-facing masking to "offline" happens in `toUIMessageStream.onError`.
    onError: ({ error }) => {
      console.error("[assistant] model stream error:", error)
    },
  })

  return toUIMessageStream<ToolSet, AssistantUIMessage>({
    stream: result.fullStream,
    sendReasoning: false,
    sendSources: false,
    messageMetadata: ({ part }) =>
      part.type === "finish" && metaRef.value ? metaRef.value : undefined,
    onError: () => "offline",
  })
}
