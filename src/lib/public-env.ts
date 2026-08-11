/**
 * Single source for public (`NEXT_PUBLIC_*`) environment values.
 *
 * Next statically inlines literal `process.env.NEXT_PUBLIC_*` reads at build time,
 * so these are safe to expose in the client bundle. Centralizing them here keeps
 * `process.env` access in one auditable module; consumers import `publicEnv`
 * instead of reaching for `process.env` themselves.
 */

export const publicEnv = {
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  formspreeFormId: process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID,
} as const
