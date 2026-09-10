import type { ColorMode, EffectiveMode, ThemeName } from "@/lib/theme"
import { cookies, headers } from "next/headers"
import {
  MODE_COOKIE,
  normalizeMode,
  normalizeTheme,
  resolveEffectiveMode,
  THEME_COOKIE,
} from "@/lib/theme"
import "server-only"

export type ResolvedTheme = {
  theme: ThemeName
  mode: ColorMode
  effectiveMode: EffectiveMode
}

/**
 * Resolves theme, color mode, and the effective mode from the request cookies
 * and the `sec-ch-prefers-color-scheme` client hint. The layout uses it to set
 * the initial <html> attributes before paint; the shell seeds its React state
 * from the theme and mode so the first client render matches.
 */
export async function resolveThemeFromRequest(): Promise<ResolvedTheme> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])

  const theme = normalizeTheme(cookieStore.get(THEME_COOKIE)?.value)
  const mode = normalizeMode(cookieStore.get(MODE_COOKIE)?.value)
  const systemMode: EffectiveMode
    = headerStore.get("sec-ch-prefers-color-scheme") === "light" ? "light" : "dark"
  const effectiveMode = resolveEffectiveMode(mode, systemMode)

  return { theme, mode, effectiveMode }
}
