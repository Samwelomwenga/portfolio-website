import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.credly.com",
        pathname: "/images/**",
      },
    ],
  },
  // Ask the browser to send the OS color-scheme preference so the layout can render
  // the correct palette server-side (see app/layout.tsx). Critical-CH makes Chromium
  // retry the initial navigation with the hint, so even the first visit is flash-free
  // there; Vary keeps caches correct. Chromium-only — other browsers just ignore it.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Accept-CH", value: "Sec-CH-Prefers-Color-Scheme" },
          { key: "Critical-CH", value: "Sec-CH-Prefers-Color-Scheme" },
          { key: "Vary", value: "Sec-CH-Prefers-Color-Scheme" },
        ],
      },
    ]
  },
}

export default nextConfig
