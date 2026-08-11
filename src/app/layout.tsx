import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { cookies, headers } from "next/headers"
import { Providers } from "@/app/providers"
import {
  MODE_COOKIE,
  normalizeMode,
  normalizeTheme,
  resolveEffectiveMode,
  THEME_COOKIE,
} from "@/lib/theme"
import "@/app/globals.css"

// Self-hosted (drops the render-blocking Google Fonts @import the Vite build used).
// Owns the --font-terminal CSS var consumed by body/font-mono/font-sans in globals.css.
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-terminal",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
})

export const metadata: Metadata = {
  title: "Samwel Omwenga | Software Engineer Portfolio",
  description:
    "Samwel Omwenga — Software Engineer. A terminal-inspired portfolio covering skills, experience, projects, blogs, and contact.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])

  const theme = normalizeTheme(cookieStore.get(THEME_COOKIE)?.value)
  const mode = normalizeMode(cookieStore.get(MODE_COOKIE)?.value)

  const colorSchemeHint = headerStore.get("sec-ch-prefers-color-scheme")
  const systemMode = colorSchemeHint === "light" ? "light" : "dark"
  const effectiveMode = resolveEffectiveMode(mode, systemMode)

  return (
    <html
      lang="en"
      className={jetBrainsMono.variable}
      data-theme={theme}
      data-mode={mode}
      data-effective-mode={effectiveMode}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
