import type { ColorMode, EffectiveMode, ThemeName } from "@/lib/theme"
import { useEffect, useState } from "react"
import {
  MODE_COOKIE,
  normalizeMode,
  normalizeTheme,
  resolveEffectiveMode,
  THEME_COOKIE,
} from "@/lib/theme"

// One year; theme choice is a durable preference, not a session value.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

// SameSite=Lax so the cookie rides top-level navigations (incl. reloads) and the
// Server Component layout can read it on the next request. No Secure flag so it
// also works over http on localhost. Path=/ covers the whole site.
function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

// The layout already resolved theme/mode from the cookie (+ client hint) and wrote
// them onto <html> before paint, so the DOM is the source of truth on mount — no
// need to re-parse cookies, and nothing to hydrate-mismatch.
function readInitialTheme(): ThemeName {
  return normalizeTheme(document.documentElement.dataset.theme)
}

function readInitialMode(): ColorMode {
  return normalizeMode(document.documentElement.dataset.mode)
}

function getSystemMode(): EffectiveMode {
  if (typeof window.matchMedia !== "function") {
    return "dark"
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
}

export type TerminalTheme = {
  theme: ThemeName
  mode: ColorMode
  effectiveMode: EffectiveMode
  setTheme: (theme: ThemeName) => void
  setMode: (mode: ColorMode) => void
}

export function useTerminalTheme(): TerminalTheme {
  const [theme, setTheme] = useState<ThemeName>(readInitialTheme)
  const [mode, setMode] = useState<ColorMode>(readInitialMode)
  const [systemMode, setSystemMode] = useState<EffectiveMode>(getSystemMode)

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return
    }

    const media = window.matchMedia("(prefers-color-scheme: light)")
    const sync = () => setSystemMode(media.matches ? "light" : "dark")
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  const effectiveMode = resolveEffectiveMode(mode, systemMode)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.dataset.mode = mode
    root.dataset.effectiveMode = effectiveMode
  }, [theme, mode, effectiveMode])

  function updateTheme(next: ThemeName) {
    setTheme(next)
    writeCookie(THEME_COOKIE, next)
  }

  function updateMode(next: ColorMode) {
    setMode(next)
    writeCookie(MODE_COOKIE, next)
  }

  return { theme, mode, effectiveMode, setTheme: updateTheme, setMode: updateMode }
}
