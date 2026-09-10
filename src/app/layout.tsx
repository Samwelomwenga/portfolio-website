import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Providers } from "@/app/providers"
import { TerminalShell } from "@/components/terminal/terminal-shell"
import { publicEnv } from "@/lib/env"
import { resolveThemeFromRequest } from "@/lib/theme-server"
import "@/app/globals.css"

// Self-hosted (drops the render-blocking Google Fonts @import the Vite build used).
// Owns the --font-terminal CSS var consumed by body/font-mono/font-sans in globals.css.
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-terminal",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
})

const title = "Samwel Omwenga | Software Engineer Portfolio"
const description
  = "Samwel Omwenga — Software Engineer. A terminal-inspired portfolio covering skills, experience, projects, blogs, and contact."

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Samwel Omwenga",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    // Browser tab icons — browsers pick the best match for their tab/bar resolution
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicons/favicon-64x64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicons/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicons/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    // Apple devices — iOS home screen, Safari pinned tab, etc.
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme, mode, effectiveMode } = await resolveThemeFromRequest()

  return (
    <html
      lang="en"
      className={jetBrainsMono.variable}
      data-theme={theme}
      data-mode={mode}
      data-effective-mode={effectiveMode}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Providers>
          <TerminalShell initialTheme={theme} initialMode={mode}>
            {children}
          </TerminalShell>
        </Providers>
      </body>
    </html>
  )
}
