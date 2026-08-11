"use client"

import type { ArchiveRoute } from "@/lib/routes"
import type { SectionId } from "@/portfolio-data"
import { AnimatePresence, motion } from "motion/react"
import { useRef } from "react"
import { ArchiveScreen } from "@/components/archive-screen"
import { HomeScreens } from "@/components/sections/home-screens"
import { TerminalFrame } from "@/components/terminal/terminal-frame"
import { useActiveSection } from "@/hooks/use-active-section"
import { useHashRoute } from "@/hooks/use-hash-route"
import { useTerminalTheme } from "@/hooks/use-terminal-theme"
import { routeTransition } from "@/lib/motion"
import { getRouteFromHash } from "@/lib/routes"
import { isSectionId, sectionIds } from "@/lib/sections"

export function AppRoot() {
  const { theme, mode, effectiveMode, setTheme, setMode } = useTerminalTheme()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { route, routeDirection, runPendingHashScroll } = useHashRoute({ scrollRef, isSectionId })

  const { activeId, jumpTo } = useActiveSection(scrollRef, sectionIds, route === "home")
  const displayedActive = route === "home" ? activeId : route

  function handleNavigate(id: SectionId) {
    if (getRouteFromHash() !== "home") {
      window.location.hash = `#${id}`
      return
    }
    window.history.replaceState(null, "", `#${id}`)
    jumpTo(id)
  }

  function goToArchive(target: ArchiveRoute) {
    window.location.hash = `#/${target}`
  }

  return (
    <TerminalFrame
      theme={theme}
      mode={mode}
      effectiveMode={effectiveMode}
      activeId={displayedActive}
      onNavigate={handleNavigate}
      onThemeChange={setTheme}
      onModeChange={setMode}
      scrollRef={scrollRef}
    >
      <AnimatePresence mode="wait" custom={routeDirection}>
        <motion.div
          key={route}
          custom={routeDirection}
          initial="enter"
          animate="center"
          exit="exit"
          variants={routeTransition}
          onAnimationStart={() => {
            if (route === "home") {
              runPendingHashScroll()
            }
          }}
          onAnimationComplete={() => {
            if (route === "home") {
              runPendingHashScroll()
            }
          }}
        >
          {route === "home"
            ? <HomeScreens onNavigate={handleNavigate} onArchive={goToArchive} />
            : <ArchiveScreen route={route} onNavigate={handleNavigate} />}
        </motion.div>
      </AnimatePresence>
    </TerminalFrame>
  )
}
