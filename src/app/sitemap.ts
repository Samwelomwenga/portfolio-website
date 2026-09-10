import type { MetadataRoute } from "next"
import { publicEnv } from "@/lib/env"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: publicEnv.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
