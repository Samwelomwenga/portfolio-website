import type { RouteDirection } from "@/lib/motion"

export const archiveRoutes = ["experience", "projects", "blogs"] as const

export type ArchiveRoute = (typeof archiveRoutes)[number]
export type Route = "home" | ArchiveRoute

export type RouteState = {
  route: Route
  direction: RouteDirection
}

export function getRouteFromHash(hash: string = window.location.hash): Route {
  const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash
  if (cleanHash.startsWith("/")) {
    const candidate = cleanHash.slice(1)
    return archiveRoutes.includes(candidate as ArchiveRoute) ? candidate as ArchiveRoute : "home"
  }
  return "home"
}

function getRouteRank(route: Route): number {
  return route === "home" ? 0 : archiveRoutes.indexOf(route) + 1
}

export function getRouteDirection(from: Route, to: Route): RouteDirection {
  if (from === to) {
    return 0
  }
  return getRouteRank(to) > getRouteRank(from) ? 1 : -1
}
