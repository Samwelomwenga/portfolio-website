/**
 * Environment-agnostic theme data + normalization. Pure module (no React, no
 * window/document) so it can run in the Server Component layout (which reads the
 * theme cookie + Sec-CH-Prefers-Color-Scheme hint to set the initial <html>
 * attributes) and in the client `useTerminalTheme` hook alike.
 */

export type ColorMode = "dark" | "light" | "auto"
export type EffectiveMode = "dark" | "light"

type ThemeOptionDefinition = {
  id: string
  label: string
  theme: string
  mode: EffectiveMode
  swatches: readonly [string, string, string]
}

export const themeOptions = [
  { id: "catppuccin", label: "catppuccin", theme: "catppuccin", mode: "dark", swatches: ["#181825", "#89b4fa", "#a6e3a1"] },
  { id: "terminal", label: "terminal", theme: "terminal", mode: "dark", swatches: ["#111111", "#5f9fff", "#30d158"] },
  { id: "tokyo-night", label: "tokyo night", theme: "tokyo-night", mode: "dark", swatches: ["#1a1b26", "#7aa2f7", "#bb9af7"] },
  { id: "dracula", label: "dracula", theme: "dracula", mode: "dark", swatches: ["#282a36", "#bd93f9", "#ff79c6"] },
  { id: "nord", label: "nord", theme: "nord", mode: "dark", swatches: ["#2e3440", "#88c0d0", "#a3be8c"] },
  { id: "gruvbox", label: "gruvbox", theme: "gruvbox", mode: "dark", swatches: ["#282828", "#d79921", "#b8bb26"] },
  { id: "one-dark", label: "one dark", theme: "one-dark", mode: "dark", swatches: ["#282c34", "#61afef", "#c678dd"] },
  { id: "solarized", label: "solarized", theme: "solarized", mode: "dark", swatches: ["#002b36", "#268bd2", "#2aa198"] },
  { id: "kanagawa", label: "kanagawa", theme: "kanagawa", mode: "dark", swatches: ["#1f1f28", "#7e9cd8", "#c0a36e"] },
  { id: "rose-pine", label: "rose pine", theme: "rose-pine", mode: "dark", swatches: ["#191724", "#c4a7e7", "#eb6f92"] },
  { id: "vesper", label: "vesper", theme: "vesper", mode: "dark", swatches: ["#1a1a1a", "#ffc799", "#99ffe4"] },
  { id: "night-owl", label: "Night Owl", theme: "night-owl", mode: "dark", swatches: ["#011627", "#82aaff", "#22da6e"] },
  { id: "better-solarized", label: "Better Solarized Dark", theme: "better-solarized", mode: "dark", swatches: ["#002b36", "#268bd2", "#859900"] },
  { id: "better-selenized", label: "Better Selenized Dark", theme: "better-selenized", mode: "dark", swatches: ["#053d48", "#0096f5", "#80b83c"] },
  { id: "poimandres", label: "poimandres", theme: "poimandres", mode: "dark", swatches: ["#1b1e28", "#add7ff", "#5de4c7"] },
  { id: "poimandres-storm", label: "poimandres-storm", theme: "poimandres-storm", mode: "dark", swatches: ["#252b37", "#add7ff", "#5de4c7"] },
  { id: "sapphire", label: "Sapphire", theme: "sapphire", mode: "dark", swatches: ["#181e29", "#399ef4", "#4eb071"] },
  { id: "sapphire-bright", label: "Sapphire (Bright)", theme: "sapphire-bright", mode: "dark", swatches: ["#2a3447", "#399ef4", "#4eb071"] },
  { id: "sapphire-dim", label: "Sapphire (Dim)", theme: "sapphire-dim", mode: "dark", swatches: ["#080d14", "#399ef4", "#4eb071"] },
  { id: "city-lights", label: "City Lights", theme: "city-lights", mode: "dark", swatches: ["#1d252c", "#718ca1", "#8bd49c"] },
  { id: "winter-is-coming", label: "Winter is Coming (Dark Blue)", theme: "winter-is-coming", mode: "dark", swatches: ["#011627", "#219fd5", "#22da6e"] },
  { id: "winter-is-coming-black", label: "Winter is Coming (Dark Black)", theme: "winter-is-coming-black", mode: "dark", swatches: ["#282822", "#219fd5", "#22da6e"] },
  { id: "vue", label: "Vue Theme", theme: "vue", mode: "dark", swatches: ["#002b36", "#009aaf", "#ffcc95"] },
  { id: "vue-high-contrast", label: "Vue Theme High Contrast", theme: "vue-high-contrast", mode: "dark", swatches: ["#002933", "#00b7ff", "#ffbe79"] },
  { id: "visual-studio-cpp", label: "Dark (Visual Studio - C/C++)", theme: "visual-studio-cpp", mode: "dark", swatches: ["#1e1e1e", "#007acc", "#ce9178"] },
  { id: "visual-studio-cpp-2017", label: "2017 Dark (Visual Studio - C/C++)", theme: "visual-studio-cpp-2017", mode: "dark", swatches: ["#1e1e1e", "#007acc", "#ce9178"] },
  { id: "visual-studio-2019", label: "Visual Studio 2019 Dark", theme: "visual-studio-2019", mode: "dark", swatches: ["#1e1e1e", "#007acc", "#ce9178"] },
  { id: "catppuccin-latte", label: "catppuccin latte", theme: "catppuccin", mode: "light", swatches: ["#eff1f5", "#1e66f5", "#40a02b"] },
  { id: "tokyo-night-day", label: "tokyo day", theme: "tokyo-night", mode: "light", swatches: ["#e1e2e7", "#2e7de9", "#7847bd"] },
  { id: "gruvbox-light", label: "gruvbox light", theme: "gruvbox", mode: "light", swatches: ["#fbf1c7", "#076678", "#79740e"] },
  { id: "one-light", label: "one light", theme: "one-dark", mode: "light", swatches: ["#fafafa", "#4078f2", "#a626a4"] },
  { id: "solarized-light", label: "solarized light", theme: "solarized", mode: "light", swatches: ["#fdf6e3", "#268bd2", "#859900"] },
  { id: "kanagawa-lotus", label: "kanagawa lotus", theme: "kanagawa", mode: "light", swatches: ["#f2ecbc", "#4d699b", "#6f894e"] },
  { id: "rose-pine-dawn", label: "rose pine dawn", theme: "rose-pine", mode: "light", swatches: ["#faf4ed", "#907aa9", "#b4637a"] },
  { id: "night-owl-light", label: "Night Owl Light", theme: "night-owl", mode: "light", swatches: ["#fbfbfb", "#288ed7", "#08916a"] },
  { id: "better-solarized-light", label: "Better Solarized Light", theme: "better-solarized", mode: "light", swatches: ["#fdf6e3", "#268bd2", "#859900"] },
  { id: "better-selenized-light", label: "Better Selenized Light", theme: "better-selenized", mode: "light", swatches: ["#fef3da", "#268bd2", "#859900"] },
  { id: "winter-is-coming-light", label: "Winter is Coming (Light)", theme: "winter-is-coming", mode: "light", swatches: ["#ffffff", "#236ebf", "#08916a"] },
  { id: "visual-studio-cpp-light", label: "Light (Visual Studio - C/C++)", theme: "visual-studio-cpp", mode: "light", swatches: ["#ffffff", "#007acc", "#a31515"] },
  { id: "visual-studio-cpp-2017-light", label: "2017 Light (Visual Studio - C/C++)", theme: "visual-studio-cpp-2017", mode: "light", swatches: ["#ffffff", "#007acc", "#a31515"] },
  { id: "visual-studio-2019-light", label: "Visual Studio 2019 Light", theme: "visual-studio-2019", mode: "light", swatches: ["#ffffff", "#007acc", "#a31515"] },
] as const satisfies readonly ThemeOptionDefinition[]

export type ThemeOption = typeof themeOptions[number]
export type ThemeName = ThemeOption["theme"]
export type ThemeVariantName = ThemeOption["id"]

type ThemeFamily = {
  id: ThemeName
  dark: ThemeVariantName
  light?: ThemeVariantName
}

const themeFamilies = [
  { id: "catppuccin", dark: "catppuccin", light: "catppuccin-latte" },
  { id: "terminal", dark: "terminal" },
  { id: "tokyo-night", dark: "tokyo-night", light: "tokyo-night-day" },
  { id: "dracula", dark: "dracula" },
  { id: "nord", dark: "nord" },
  { id: "gruvbox", dark: "gruvbox", light: "gruvbox-light" },
  { id: "one-dark", dark: "one-dark", light: "one-light" },
  { id: "solarized", dark: "solarized", light: "solarized-light" },
  { id: "kanagawa", dark: "kanagawa", light: "kanagawa-lotus" },
  { id: "rose-pine", dark: "rose-pine", light: "rose-pine-dawn" },
  { id: "vesper", dark: "vesper" },
  { id: "night-owl", dark: "night-owl", light: "night-owl-light" },
  { id: "better-solarized", dark: "better-solarized", light: "better-solarized-light" },
  { id: "better-selenized", dark: "better-selenized", light: "better-selenized-light" },
  { id: "poimandres", dark: "poimandres" },
  { id: "poimandres-storm", dark: "poimandres-storm" },
  { id: "sapphire", dark: "sapphire" },
  { id: "sapphire-bright", dark: "sapphire-bright" },
  { id: "sapphire-dim", dark: "sapphire-dim" },
  { id: "city-lights", dark: "city-lights" },
  { id: "winter-is-coming", dark: "winter-is-coming", light: "winter-is-coming-light" },
  { id: "winter-is-coming-black", dark: "winter-is-coming-black" },
  { id: "vue", dark: "vue" },
  { id: "vue-high-contrast", dark: "vue-high-contrast" },
  { id: "visual-studio-cpp", dark: "visual-studio-cpp", light: "visual-studio-cpp-light" },
  { id: "visual-studio-cpp-2017", dark: "visual-studio-cpp-2017", light: "visual-studio-cpp-2017-light" },
  { id: "visual-studio-2019", dark: "visual-studio-2019", light: "visual-studio-2019-light" },
] as const satisfies readonly ThemeFamily[]

/** Cookie names — persisted client-side and read by the Server Component layout. */
export const THEME_COOKIE = "portfolio-theme"
export const MODE_COOKIE = "portfolio-mode"

export const DEFAULT_THEME: ThemeName = "tokyo-night"
export const DEFAULT_MODE: ColorMode = "auto"

const themeIds = themeFamilies.map(item => item.id)
const themeAliases: Partial<Record<string, ThemeName>> = {
  "cappuccino": "catppuccin",
  "catppuccin-latte": "catppuccin",
  "catppuccin-mocha": "catppuccin",
  "dawn": "rose-pine",
  "gruvbox-dark": "gruvbox",
  "gruvbox-light": "gruvbox",
  "latte": "catppuccin",
  "light": "catppuccin",
  "lotus": "kanagawa",
  "night-owl-light": "night-owl",
  "night-owl-light-no-italics": "night-owl",
  "night-owl-no-italics": "night-owl",
  "one-light": "one-dark",
  "onedark": "one-dark",
  "onelight": "one-dark",
  "rosepine": "rose-pine",
  "rose-pine-dawn": "rose-pine",
  "rosepine-dawn": "rose-pine",
  "solarized-dark": "solarized",
  "solarized-light": "solarized",
  "tokyo": "tokyo-night",
  "tokyo-day": "tokyo-night",
  "tokyo-night-day": "tokyo-night",
  "tokyonight": "tokyo-night",
  "tokyonight-day": "tokyo-night",
  "better-solarized-italics": "better-solarized",
  "better-solarized-light": "better-solarized",
  "better-selenized-light": "better-selenized",
  "poimandres-noitalics": "poimandres",
  "poimandres-noitalics-storm": "poimandres-storm",
  "visual-studio-cpp-light": "visual-studio-cpp",
  "visual-studio-cpp-2017-light": "visual-studio-cpp-2017",
  "visual-studio-2019-light": "visual-studio-2019",
  "winter-is-coming-light": "winter-is-coming",
  "winter-is-coming-black-no-italics": "winter-is-coming-black",
  "winter-is-coming-light-no-italics": "winter-is-coming",
  "winter-is-coming-no-italics": "winter-is-coming",
}

/** Normalizes a stored/aliased theme value to a known theme, falling back to the default. */
export function normalizeTheme(value: string | null | undefined): ThemeName {
  const normalized = value?.toLowerCase().replaceAll("_", "-").replaceAll(" ", "-")
  const alias = normalized ? themeAliases[normalized] : undefined

  if (alias) {
    return alias
  }

  return normalized && (themeIds as readonly string[]).includes(normalized) ? normalized as ThemeName : DEFAULT_THEME
}

/** Normalizes a stored color-mode value, falling back to the default. */
export function normalizeMode(value: string | null | undefined): ColorMode {
  return value === "dark" || value === "light" || value === "auto" ? value : DEFAULT_MODE
}

/** Resolves the concrete light/dark mode, applying the system preference when set to auto. */
export function resolveEffectiveMode(mode: ColorMode, systemMode: EffectiveMode): EffectiveMode {
  return mode === "auto" ? systemMode : mode
}

export function getThemeOption(theme: ThemeName, effectiveMode: EffectiveMode): ThemeOption {
  const family: ThemeFamily | undefined = themeFamilies.find(item => item.id === theme)
  const variant = effectiveMode === "light" && family?.light ? family.light : family?.dark

  return themeOptions.find(item => item.id === variant) ?? themeOptions[0]
}
