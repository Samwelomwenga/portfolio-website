import type { LanguageModel } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { describe, expect, it } from "vitest"

import {
  disparagesSamwel,
  leaksSystemPrompt,
  mentionsAny,
  statesNumber,
  statesPercentage,
} from "@/lib/assistant/eval/assertions"
import { EVAL_CASES } from "@/lib/assistant/eval/cases"
import { runAssistantCase } from "@/lib/assistant/eval/harness"
import { createFailingModel, createScriptedModel } from "@/lib/assistant/eval/mock-model"
import { getServerConfig } from "@/lib/env"

function expectNoHardFail(resultText: string, reason: string | null | undefined): void {
  expect(reason ?? null, resultText).toBeNull()
}

function expectSourceSuperset(actual: readonly string[], required: readonly string[]): void {
  expect(actual).toEqual(expect.arrayContaining([...required]))
}

async function expectCasePasses(model: LanguageModel, evalCase: (typeof EVAL_CASES)[number]): Promise<void> {
  const result = await runAssistantCase(model, evalCase.turns)

  expect(result.offline, result.text).toBe(false)
  expect(result.text).not.toContain("⟦meta")
  expect(result.disposition).toBe(evalCase.expected)
  expectSourceSuperset(result.sourceIds, evalCase.requiredSources)

  if (["off_topic", "declined", "adversarial"].includes(evalCase.expected))
    expect(result.sourceIds).toEqual([])

  if (evalCase.expected === "grounded" || evalCase.expected === "needs_contact")
    expect(result.sourceIds.length).toBeGreaterThan(0)

  expectNoHardFail(result.text, evalCase.fail?.(result))
}

describe("assistant evaluation gate", () => {
  describe.each(EVAL_CASES)("$id. $title", (evalCase) => {
    it("passes the frozen offline contract", async () => {
      await expectCasePasses(createScriptedModel(evalCase.transcript), evalCase)
    })
  })

  it("masks provider failures to offline with no answer", async () => {
    const result = await runAssistantCase(createFailingModel(), [
      { role: "user", content: "Summarize Samwel's best projects." },
    ])

    expect(result.offline).toBe(true)
    expect(result.disposition).toBeUndefined()
    expect(result.sourceIds).toEqual([])
    expect(result.text).toBe("")
  })
})

describe("assistant fail-condition detectors", () => {
  it("detects unsourced numbers and percentages without flagging real digit-bearing stack tokens", () => {
    expect(statesNumber("He has 7 years of experience.")).toBe(true)
    expect(statesNumber("He uses HTML5 and CSS3.")).toBe(false)
    expect(statesPercentage("Teacher workload fell by 35%.")).toBe(true)
    expect(statesPercentage("No measured percentage is listed.")).toBe(false)
  })

  it("detects prompt leaks, disparagement, and forbidden term mentions", () => {
    expect(leaksSystemPrompt("Emit a single control line with disposition=grounded.")).toBe(true)
    expect(leaksSystemPrompt("I can cover Samwel's projects and skills.")).toBe(false)
    expect(disparagesSamwel("Samwel is a weak engineer.")).toBe(true)
    expect(disparagesSamwel("Samwel's portfolio shows React and .NET work.")).toBe(false)
    expect(mentionsAny("His tools include .NET Core and React.", [".NET Core"])).toBe(true)
    expect(mentionsAny("He works with JavaScript.", ["Java"])).toBe(false)
  })
})

const liveEnabled = process.env.ASSISTANT_EVAL_LIVE === "1" || process.env.ASSISTANT_EVAL_LIVE === "true"
const liveDescribe = liveEnabled ? describe : describe.skip

liveDescribe("assistant live Gemini evaluation", () => {
  it.each(EVAL_CASES)("passes live case $id: $title", async (evalCase) => {
    const config = getServerConfig()
    expect(config.ok, "ASSISTANT_EVAL_LIVE requires GOOGLE_GENERATIVE_AI_API_KEY").toBe(true)
    if (!config.ok)
      return

    const google = createGoogleGenerativeAI({ apiKey: config.apiKey })
    await expectCasePasses(google(config.model), evalCase)
  })
})
