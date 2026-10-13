import type { LanguageModel } from "ai"
import { readUIMessageStream } from "ai"
import { afterEach, describe, expect, it, vi } from "vitest"

import { createFailingModel, createStalledModel } from "@/lib/assistant/eval/mock-model"
import { streamAssistant } from "@/lib/assistant/run"

const CONTRACT_MESSAGE = "assistant response is missing a valid control line"

async function run(model: LanguageModel, signal?: AbortSignal) {
  const logged: string[] = []
  vi.spyOn(console, "error").mockImplementation((_tag: unknown, error: unknown) => {
    logged.push(error instanceof Error ? error.message : String(error))
  })

  const stream = streamAssistant({ model, system: "system", messages: [{ role: "user", content: "hi" }], signal })
  let offline = false
  await Array.fromAsync(readUIMessageStream({ stream, onError: () => {
    offline = true
  } }))
  return { logged, offline }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe("streamAssistant failure reporting", () => {
  it("reports a timeout before the control line as an abort, not a contract violation", async () => {
    const { logged, offline } = await run(createStalledModel(), AbortSignal.timeout(20))

    expect(offline).toBe(true)
    expect(logged).not.toContain(CONTRACT_MESSAGE)
    expect(logged.join("\n")).toMatch(/aborted/i)
  })

  it("logs only the provider error when the provider fails before any text", async () => {
    const { logged, offline } = await run(createFailingModel())

    expect(offline).toBe(true)
    expect(logged).toEqual(["simulated provider failure"])
  })
})
