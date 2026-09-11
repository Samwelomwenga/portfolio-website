import { useSyncExternalStore } from "react"

/**
 * Subscribes to a CSS media query. `serverValue` is used for the server render
 * and the client's first render; React then swaps in the real match before
 * paint, so there is no hydration mismatch and no effect.
 */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  function subscribe(onChange: () => void) {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return () => {}
    }
    const media = window.matchMedia(query)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }

  return useSyncExternalStore(
    subscribe,
    () => (typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : serverValue),
    () => serverValue,
  )
}
