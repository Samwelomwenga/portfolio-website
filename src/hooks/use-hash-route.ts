import type { RefObject } from "react"
import type { Route, RouteState } from "@/lib/routes"
import type { SectionId } from "@/portfolio-data"
import { useCallback, useEffect, useRef, useState } from "react"
import { getRouteDirection, getRouteFromHash } from "@/lib/routes"

type UseHashRouteOptions = {
  scrollRef: RefObject<HTMLElement | null>
  isSectionId: (value: string) => value is SectionId
}

export function useHashRoute({ scrollRef, isSectionId }: UseHashRouteOptions) {
  const [routeState, setRouteState] = useState<RouteState>(() => ({
    route: getRouteFromHash(),
    direction: 0,
  }))
  const { route, direction: routeDirection } = routeState
  const routeRef = useRef<Route>(route)
  const pendingHashScrollRef = useRef<ScrollBehavior | null>(null)

  const scrollToHashSection = useCallback((behavior: ScrollBehavior = "smooth"): boolean => {
    const hash = window.location.hash.slice(1)
    if (!isSectionId(hash)) {
      return true
    }

    const host = scrollRef.current
    const target = host?.querySelector<HTMLElement>(`[data-section="${hash}"]`)
    if (!host || !target) {
      return false
    }

    const top = host.scrollTop + target.getBoundingClientRect().top - host.getBoundingClientRect().top
    host.scrollTo({ top: Math.max(0, top), behavior })
    return true
  }, [isSectionId, scrollRef])

  const runPendingHashScroll = useCallback(() => {
    const behavior = pendingHashScrollRef.current
    if (!behavior || routeRef.current !== "home") {
      return
    }

    window.requestAnimationFrame(() => {
      if (scrollToHashSection(behavior)) {
        pendingHashScrollRef.current = null
      }
    })
  }, [scrollToHashSection])

  useEffect(() => {
    routeRef.current = route
  }, [route])

  useEffect(() => {
    function syncRouteFromHash() {
      const nextRoute = getRouteFromHash()
      const currentRoute = routeRef.current
      if (nextRoute !== currentRoute) {
        routeRef.current = nextRoute
        setRouteState({
          route: nextRoute,
          direction: getRouteDirection(currentRoute, nextRoute),
        })
      }

      if (nextRoute !== "home") {
        pendingHashScrollRef.current = null
        scrollRef.current?.scrollTo({ top: 0, behavior: "auto" })
        return
      }

      pendingHashScrollRef.current = "smooth"
      if (currentRoute === "home") {
        runPendingHashScroll()
      }
    }

    window.addEventListener("hashchange", syncRouteFromHash)
    const frame = window.requestAnimationFrame(syncRouteFromHash)

    return () => {
      window.removeEventListener("hashchange", syncRouteFromHash)
      window.cancelAnimationFrame(frame)
    }
  }, [runPendingHashScroll, scrollRef])

  return { route, routeDirection, runPendingHashScroll } as const
}
