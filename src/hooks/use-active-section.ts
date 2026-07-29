import type { RefObject } from "react"
import { useEffect, useState } from "react"

const ACTIVE_OFFSET = 120

/**
 * Tracks which section is currently in view inside the scrollable terminal
 * window and exposes a `jumpTo` that scrolls the container (not the window) to
 * a section. Works against the inner scroll host so the fixed terminal frame
 * keeps its chrome in place while the panes scroll.
 */
export function useActiveSection(
  scrollRef: RefObject<HTMLElement | null>,
  sectionIds: readonly string[],
  enabled: boolean,
) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "")

  useEffect(() => {
    const host = scrollRef.current
    if (!enabled || !host) {
      return
    }

    function detect() {
      const host = scrollRef.current
      if (!host) {
        return
      }

      const hostTop = host.getBoundingClientRect().top
      const threshold = host.scrollTop + ACTIVE_OFFSET
      let current = sectionIds[0] ?? ""

      for (const id of sectionIds) {
        const section = host.querySelector<HTMLElement>(`[data-section="${id}"]`)
        if (!section) {
          continue
        }
        const top = host.scrollTop + section.getBoundingClientRect().top - hostTop
        if (top <= threshold) {
          current = id
        }
      }

      setActiveId(current)
    }

    host.addEventListener("scroll", detect, { passive: true })
    const frame = window.requestAnimationFrame(detect)

    return () => {
      host.removeEventListener("scroll", detect)
      window.cancelAnimationFrame(frame)
    }
  }, [scrollRef, sectionIds, enabled])

  function jumpTo(id: string) {
    const host = scrollRef.current
    const target = host?.querySelector<HTMLElement>(`[data-section="${id}"]`)
    if (!host || !target) {
      return
    }

    const top = host.scrollTop + target.getBoundingClientRect().top - host.getBoundingClientRect().top
    host.scrollTo({ top: Math.max(0, top), behavior: "smooth" })
    setActiveId(id)
  }

  return { activeId, jumpTo }
}
