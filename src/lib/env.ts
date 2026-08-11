/**
 * Single auditable source for environment access, both public and server-only.
 *
 * Keeping every `process.env` read here means the client/server boundary is
 * reviewed in one place rather than scattered across the codebase.
 *
 * - `publicEnv` holds `NEXT_PUBLIC_*` values. Next statically inlines literal
 *   `process.env.NEXT_PUBLIC_*` reads at build time, so these are safe in the
 *   client bundle.
 * - `getServerConfig()` reads the assistant's server-only secret. It is a
 *   non-`NEXT_PUBLIC_` var, so Next never inlines its value into the client
 *   bundle (it resolves to `undefined` on the client). This module is imported
 *   by client components for `publicEnv`, so it cannot carry an
 *   `import "server-only"` guard — call `getServerConfig()` from server code
 *   only (the `/api/assistant` route handler).
 */

export const publicEnv = {
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  formspreeFormId: process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID,
} as const

/** Default Gemini model when `ASSISTANT_MODEL` is unset (frozen by ticket 07). */
const DEFAULT_MODEL = "gemini-3.5-flash"

/**
 * Result of resolving the server-only assistant configuration. Discriminated on
 * `ok` so callers must handle the degraded branch explicitly rather than reading
 * a possibly-undefined key.
 */
export type ServerConfig
  = | { ok: true, apiKey: string, model: string }
    | { ok: false, reason: "missing_config" }

/**
 * Reads the server-only assistant secrets and degrades instead of throwing.
 *
 * `GOOGLE_GENERATIVE_AI_API_KEY` is the Vercel AI SDK's default key name for the
 * `@ai-sdk/google` provider (zero extra wiring). `ASSISTANT_MODEL` optionally
 * overrides the default model. A missing or blank key returns
 * `{ ok: false, reason: "missing_config" }` so the route handler can answer
 * HTTP 503 `offline` instead of crashing (ticket 07 failure behavior).
 */
export function getServerConfig(): ServerConfig {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()
  if (!apiKey) {
    return { ok: false, reason: "missing_config" }
  }

  const model = process.env.ASSISTANT_MODEL?.trim() || DEFAULT_MODEL
  return { ok: true, apiKey, model }
}
