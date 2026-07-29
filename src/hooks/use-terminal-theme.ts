import { useCallback, useEffect, useState } from "react"

export type ThemeName = "tokyo" | "cappuccino"
export type ColorMode = "dark" | "light" | "auto"
export type EffectiveMode = "dark" | "light"

export const themes: { id: ThemeName, label: string }[] = [
  { id: "tokyo", label: "tokyo night" },
  { id: "cappuccino", label: "cappuccino" },
]

const THEME_KEY = "portfolio-theme"
const MODE_KEY = "portfolio-mode"
const DEFAULT_THEME: ThemeName = "tokyo"
const DEFAULT_MODE: ColorMode = "auto"

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value && (allowed as readonly string[]).includes(value) ? value as T : fallback
  }
  catch {
    return fallback
  }
}

function prefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export type TerminalTheme = {
  theme: ThemeName
  mode: ColorMode
  effectiveMode: EffectiveMode
  setTheme: (theme: ThemeName) => void
  setMode: (mode: ColorMode) => void
}

export function useTerminalTheme(): TerminalTheme {
  const [theme, setThemeState] = useState<ThemeName>(() =>
    readStored(THEME_KEY, ["tokyo", "cappuccino"] as const, DEFAULT_THEME),
  )
  const [mode, setModeState] = useState<ColorMode>(() =>
    readStored(MODE_KEY, ["dark", "light", "auto"] as const, DEFAULT_MODE),
  )
  const [systemDark, setSystemDark] = useState<boolean>(() => prefersDark())

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const sync = () => setSystemDark(media.matches)
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  const effectiveMode: EffectiveMode = mode === "auto" ? (systemDark ? "dark" : "light") : mode

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.dataset.mode = mode
    root.dataset.effectiveMode = effectiveMode
  }, [theme, mode, effectiveMode])

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    }
    catch {
      // Ignore storage failures (private mode, disabled storage).
    }
  }, [])

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next)
    try {
      localStorage.setItem(MODE_KEY, next)
    }
    catch {
      // Ignore storage failures (private mode, disabled storage).
    }
  }, [])

  return { theme, mode, effectiveMode, setTheme, setMode }
}
