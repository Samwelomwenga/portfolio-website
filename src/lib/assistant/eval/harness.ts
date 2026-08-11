import type { LanguageModel } from "ai"

import type { ConversationTurn } from "@/lib/assistant/messages"
import type { Disposition } from "@/lib/assistant/meta"
import type { AssistantUIMessage } from "@/lib/assistant/run"
import { readUIMessageStream } from "ai"

import { assembleMessages, estimateTokens } from "@/lib/assistant/messages"
import { streamAssistant } from "@/lib/assistant/run"
import { buildSystemPrompt } from "@/lib/assistant/system-instruction"

/** The observable outcome of one assistant turn — what the eval asserts on. */
export type CaseResult = {
  /** Parsed control-line disposition, or `undefined` when the response degraded. */
  disposition: Disposition | undefined
  /** Source IDs the answer cited (empty for the no-source dispositions). */
  sourceIds: string[]
  /** The clean, visitor-facing prose — the control line already stripped out. */
  text: string
  /**
   * True when the pipeline masked a provider/contract failure to `offline`.
   * A degraded turn carries no disposition and no answer prose.
   */
  offline: boolean
}

/**
 * Runs one conversation through the real assistant pipeline against the supplied
 * model and returns the observable result.
 *
 * This is the exact server path the live route uses — the frozen system prompt,
 * the deterministic portfolio context, the same message assembly, the same
 * in-stream control-line strip and metadata surfacing — with only the model
 * injected. So a scripted model exercises the contract offline, and the real
 * Gemini model exercises it live, through identical code.
 */
export async function runAssistantCase(
  model: LanguageModel,
  turns: readonly ConversationTurn[],
): Promise<CaseResult> {
  const system = buildSystemPrompt()
  const messages = assembleMessages([...turns], estimateTokens(system))
  const stream = streamAssistant({ model, system, messages })

  let offline = false
  let last: AssistantUIMessage | undefined
  for await (const message of readUIMessageStream<AssistantUIMessage>({
    stream,
    onError: () => {
      offline = true
    },
  })) {
    last = message
  }

  const text = (last?.parts ?? [])
    .map(part => (part.type === "text" ? part.text : ""))
    .join("")
    .trim()

  return {
    disposition: last?.metadata?.disposition,
    sourceIds: last?.metadata?.sourceIds ?? [],
    text,
    offline,
  }
}
