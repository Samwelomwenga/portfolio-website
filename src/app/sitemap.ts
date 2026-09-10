import type { MetadataRoute } from "next"
import { publicEnv } from "@/lib/env"

const archivePaths = ["/experience", "/projects", "/blogs"] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: publicEnv.siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    ...archivePaths.map(path => ({
      url: new URL(path, publicEnv.siteUrl).href,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
