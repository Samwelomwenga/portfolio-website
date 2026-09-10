export const archiveRoutes = ["experience", "projects", "blogs"] as const

export type ArchiveRoute = (typeof archiveRoutes)[number]
