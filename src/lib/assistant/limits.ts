import "server-only"

/**
 * Free-tier guardrails for the portfolio assistant.
 *
 * Values are frozen by ticket 10 and sourced from
 * `.scratch/ai-portfolio-assistant/research/vercel-ai-sdk-gemini-controls.md`.
 * These are code constants (not env vars) for v1 so the ruleset is reviewed in
 * one place. Bump `ASSISTANT_LIMITS_VERSION` whenever any value below changes,
 * so enforcement paths and logs can pin the exact ruleset they applied.
 */
export const ASSISTANT_LIMITS_VERSION = 1

export const assistantLimits = {
  /** Max characters accepted in a single visitor question; reject over-cap before any model call. */
  promptCharCap: 1_000,
  /** Target ceiling for the fully assembled prompt (system + context + prior turns + question). */
  promptInputTokenBudget: 6_000,
  /** Per browser session. */
  perSession: { perMinute: 5, perDay: 25 },
  /** Per hashed client IP. */
  perIpHash: { perMinute: 10, perDay: 80 },
  /**
   * Site-wide successful (HTTP 200) model calls per day. Research blessed a
   * 150–200 band; enforce at the conservative lower bound.
   */
  siteWideSuccessPerDay: 150,
  /**
   * Abort the provider call after this many ms, then return offline/degraded.
   * Sits inside the frozen 10–12 s band.
   */
  providerTimeoutMs: 11_000,
} as const

export type AssistantLimits = typeof assistantLimits
