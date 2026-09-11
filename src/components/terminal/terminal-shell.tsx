"use client"

import type { ReactNode } from "react"
import type { ColorMode, ThemeName } from "@/lib/theme"
import type { SectionId } from "@/portfolio-data"
import { usePathname, useRouter } from "next/navigation"
import { createContext, use, useEffect, useRef } from "react"
import { TerminalFrame } from "@/components/terminal/terminal-frame"
import { useActiveSection } from "@/hooks/use-active-section"
import { useTerminalTheme } from "@/hooks/use-terminal-theme"
import { isSectionId, sectionIds } from "@/lib/sections"

type ShellNav = {
  navigate: (id: SectionId) => void
}

const ShellNavContext = createContext<ShellNav | null>(null)

export function useShellNav(): ShellNav {
  const value = use(ShellNavContext)
  if (!value) {
    throw new Error("useShellNav must be used inside <TerminalShell>")
  }
  return value
}

type TerminalShellProps = {
  initialTheme: ThemeName
  initialMode: ColorMode
  children: ReactNode
}

const HOME_PATH = "/"

function scrollHostToSection(host: HTMLElement, sectionId: string): boolean {
  const target = host.querySelector<HTMLElement>(`[data-section="${sectionId}"]`)
  if (!target) {
    return false
  }
  const top = host.scrollTop + target.getBoundingClientRect().top - host.getBoundingClientRect().top
  host.scrollTo({ top: Math.max(0, top), behavior: "smooth" })
  return true
}

export function TerminalShell({
  initialTheme,
  initialMode,
  children,
}: TerminalShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === HOME_PATH

  const { theme, mode, effectiveMode, setTheme, setMode } = useTerminalTheme({
    theme: initialTheme,
    mode: initialMode,
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const { activeId, jumpTo } = useActiveSection(scrollRef, sectionIds, isHome)
  const displayedActiveId = isHome ? activeId : ""

  function navigate(id: SectionId) {
    if (!isHome) {
      router.push(id === "home" ? HOME_PATH : `/#${id}`, { scroll: false })
      return
    }
    if (id === "home") {
      window.history.replaceState(null, "", HOME_PATH)
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    window.history.replaceState(null, "", `#${id}`)
    jumpTo(id)
  }

  useEffect(() => {
    if (!isHome || !scrollRef.current) {
      return
    }
    const host = scrollRef.current

    let pendingSections: MutationObserver | null = null

    function scrollToHashSection() {
      const hash = window.location.hash.slice(1)
      if (!isSectionId(hash)) {
        return
      }
      pendingSections?.disconnect()
      if (scrollHostToSection(host, hash)) {
        return
      }
      pendingSections = new MutationObserver(() => {
        if (scrollHostToSection(host, hash)) {
          pendingSections?.disconnect()
        }
      })
      pendingSections.observe(host, { childList: true, subtree: true })
    }

    scrollToHashSection()
    window.addEventListener("hashchange", scrollToHashSection)

    return () => {
      pendingSections?.disconnect()
      window.removeEventListener("hashchange", scrollToHashSection)
    }
  }, [isHome, pathname])

  return (
    <ShellNavContext value={{ navigate }}>
      <TerminalFrame
        theme={theme}
        mode={mode}
        effectiveMode={effectiveMode}
        activeId={displayedActiveId}
        onNavigate={navigate}
        onThemeChange={setTheme}
        onModeChange={setMode}
        scrollRef={scrollRef}
      >
        {children}
      </TerminalFrame>
    </ShellNavContext>
  )
}
