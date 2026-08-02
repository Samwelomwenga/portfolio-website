import type { LucideIcon } from "lucide-react"
import type { ReactNode, RefObject } from "react"
import type { ColorMode, EffectiveMode, ThemeName } from "@/hooks/use-terminal-theme"

import type { SectionId, StateColor } from "@/portfolio-data"
import { SiGithub, SiX } from "@icons-pack/react-simple-icons"
import { Linkedin, Monitor, Moon, Sun } from "lucide-react"
import { LayoutGroup, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { ThemeDialog } from "@/components/terminal/theme-dialog"
import { activeIndicatorTransition, iconButtonMicroInteraction, linkMicroInteraction, pillMicroInteraction } from "@/lib/motion"
import { cn, stateAccentClass } from "@/lib/utils"
import { navItems, profile, socialLinks } from "@/portfolio-data"

type SocialIconName = (typeof socialLinks)[number]["icon"]

const modeOptions: { id: ColorMode, icon: LucideIcon, label: string }[] = [
  { id: "dark", icon: Moon, label: "dark" },
  { id: "light", icon: Sun, label: "light" },
  { id: "auto", icon: Monitor, label: "auto" },
]

type TerminalFrameProps = {
  theme: ThemeName
  mode: ColorMode
  effectiveMode: EffectiveMode
  activeId: string
  onNavigate: (id: SectionId) => void
  onThemeChange: (theme: ThemeName) => void
  onModeChange: (mode: ColorMode) => void
  scrollRef: RefObject<HTMLDivElement | null>
  children: ReactNode
}

export function TerminalFrame({
  theme,
  mode,
  effectiveMode,
  activeId,
  onNavigate,
  onThemeChange,
  onModeChange,
  scrollRef,
  children,
}: TerminalFrameProps) {
  return (
    <>
      <a
        href="#portfolio-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2.5 focus:left-2.5 focus:z-[100] focus:rounded-sm focus:border focus:border-border focus:bg-surface focus:px-2.5 focus:py-2 focus:text-xs"
      >
        Skip to portfolio
      </a>

      <div className="grid h-[100svh] grid-cols-1 wide:grid-cols-[minmax(14.375rem,18.75rem)_minmax(0,1fr)]">
        <Sidebar activeId={activeId} onNavigate={onNavigate} />

        <main
          id="portfolio-main"
          tabIndex={-1}
          className="grid min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-panel outline-none"
          aria-label="Portfolio terminal"
        >
          <TabBar activeId={activeId} mode={mode} onNavigate={onNavigate} onModeChange={onModeChange} />
          <div id="terminal-scroll" ref={scrollRef} className="min-h-0 overflow-auto scroll-pt-6 term-scrollbar">
            {children}
          </div>
        </main>
      </div>

      <ThemeDialog theme={theme} effectiveMode={effectiveMode} onThemeChange={onThemeChange} onModeChange={onModeChange} />
    </>
  )
}

type SidebarProps = {
  activeId: string
  onNavigate: (id: SectionId) => void
}

function Sidebar({ activeId, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden min-w-0 overflow-hidden border-r border-border bg-panel wide:grid wide:grid-rows-[auto_minmax(0,1fr)]" aria-label="Portfolio workspace">
      <div className="border-b border-border p-3.5">
        <p className="mb-2 text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">workspace</p>
        <div className="grid gap-2">
          <motion.a
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              onNavigate("home")
            }}
            className="inline-flex w-max max-w-full text-[clamp(1.375rem,4vw,1.75rem)] leading-tight font-extrabold text-fg"
            {...linkMicroInteraction}
          >
            {profile.name}
          </motion.a>
          <span className="text-xs break-words text-muted">{profile.workspaceMeta}</span>
        </div>
      </div>

      <nav className="min-h-0 overflow-auto p-2 term-scrollbar" aria-label="Portfolio sections">
        <div className="mb-3">
          <div className="px-2 py-1.5 text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">pages</div>
          <LayoutGroup id="sidebar-pages">
            {navItems.map(item => (
              <TreeLink
                key={item.id}
                state={item.state}
                main={item.label}
                meta={item.meta}
                active={item.id === activeId}
                onClick={() => onNavigate(item.id)}
              />
            ))}
          </LayoutGroup>
        </div>

        <div>
          <div className="px-2 py-1.5 text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">socials</div>
          {socialLinks.map(link => (
            <TreeLink key={link.label} state={link.state} main={link.label} meta={link.meta} href={link.href} icon={link.icon} />
          ))}
        </div>
      </nav>
    </aside>
  )
}

type TreeLinkProps = {
  state: StateColor
  main: string
  meta: string
  active?: boolean
  href?: string
  icon?: SocialIconName
  suffix?: string
  onClick?: () => void
}

function TreeLink({ state, main, meta, active, href, icon, suffix, onClick }: TreeLinkProps) {
  const hasEndSlot = Boolean(icon || suffix)
  const className = cn(
    stateAccentClass(state),
    "relative grid min-h-12 w-full items-center gap-x-2 gap-y-px overflow-hidden rounded-sm px-2 py-1.5 text-left text-muted transition-colors hover:bg-surface/70 hover:text-fg data-[active=true]:text-fg",
    hasEndSlot ? "grid-cols-[0.625rem_minmax(0,1fr)_auto]" : "grid-cols-[0.625rem_minmax(0,1fr)]",
  )
  const indicator = active && !href
    ? (
        <motion.span
          layoutId="sidebar-active-section"
          className="absolute inset-0 rounded-sm bg-surface/85"
          transition={activeIndicatorTransition}
          aria-hidden="true"
        />
      )
    : null

  const dot = (
    <span
      aria-hidden="true"
      className="relative z-10 row-span-2 mt-2 size-2 self-start rounded-full bg-[color:var(--card-accent)]"
    />
  )
  const body = (
    <>
      <span className="relative z-10 col-start-2 truncate text-[0.8125rem] leading-tight font-extrabold text-fg">{main}</span>
      <span className="relative z-10 col-start-2 truncate text-[0.6875rem] leading-tight text-muted">{meta}</span>
      {icon && (
        <span className="relative z-10 col-start-3 row-span-2 grid size-7 place-items-center self-center rounded-sm border border-border bg-white/95">
          <SocialIcon icon={icon} />
        </span>
      )}
      {!icon && suffix && <span className="relative z-10 col-start-3 row-span-2 self-center text-[0.6875rem] text-muted">{suffix}</span>}
    </>
  )

  if (href) {
    return (
      <motion.a className={className} href={href} target="_blank" rel="noreferrer" {...linkMicroInteraction}>
        {dot}
        {body}
      </motion.a>
    )
  }

  return (
    <motion.button type="button" className={className} data-active={active} aria-current={active ? "page" : undefined} onClick={onClick} {...linkMicroInteraction}>
      {indicator}
      {dot}
      {body}
    </motion.button>
  )
}

function SocialIcon({ icon }: { icon: SocialIconName }) {
  switch (icon) {
    case "github":
      return <SiGithub aria-hidden="true" className="size-[0.9375rem] text-[#181717]" focusable="false" title="" />
    case "linkedin":
      return <Linkedin aria-hidden="true" className="size-[0.9375rem] text-[#0A66C2] [stroke-width:2.2]" focusable="false" />
    case "x":
      return <SiX aria-hidden="true" className="size-[0.9375rem] text-[#000000]" focusable="false" title="" />
  }
}

type TabBarProps = {
  activeId: string
  mode: ColorMode
  onNavigate: (id: SectionId) => void
  onModeChange: (mode: ColorMode) => void
}

function TabBar({ activeId, mode, onNavigate, onModeChange }: TabBarProps) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] border-b border-border bg-surface">
      <div className="flex min-w-0 overflow-x-auto hide-scrollbar" role="tablist" aria-label="Open sections">
        <LayoutGroup id="terminal-tabs">
          {navItems.map((item) => {
            const isActive = item.id === activeId
            return (
              <motion.button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`screen-${item.id}`}
                data-active={isActive}
                id={`tab-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className="relative min-h-[2.375rem] min-w-[6.75rem] shrink-0 overflow-hidden border-r border-border px-3.5 text-left text-xs font-bold tracking-[0.02em] text-muted transition-colors hover:text-fg data-[active=true]:text-[color:var(--bg)]"
                {...pillMicroInteraction}
              >
                {isActive && (
                  <motion.span
                    layoutId="tab-active-section"
                    className="absolute inset-0 bg-accent"
                    transition={activeIndicatorTransition}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{item.tab}</span>
              </motion.button>
            )
          })}
        </LayoutGroup>
      </div>

      <ModeSwitch mode={mode} onModeChange={onModeChange} />
    </div>
  )
}

type ModeSwitchProps = {
  mode: ColorMode
  onModeChange: (mode: ColorMode) => void
}

// On narrow viewports the switch collapses to just the active mode; tapping it
// reveals the rest, and picking one (or tapping outside) collapses it again.
function ModeSwitch({ mode, onModeChange }: ModeSwitchProps) {
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 40rem)").matches)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 40rem)")
    const sync = () => setCompact(query.matches)
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (!compact) {
      return
    }
    function onDocumentClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("click", onDocumentClick)
    return () => document.removeEventListener("click", onDocumentClick)
  }, [compact])

  function handleClick(id: ColorMode) {
    if (compact && !open) {
      setOpen(true)
      return
    }
    onModeChange(id)
    setOpen(false)
  }

  return (
    <div ref={ref} className="inline-flex items-stretch border-l border-border bg-[color-mix(in_oklch,var(--panel)_72%,var(--surface))]" role="group" aria-label="Color mode">
      <LayoutGroup id="mode-switch">
        {modeOptions.map(({ id, icon: Icon, label }) => {
          const isActive = id === mode
          return (
            <motion.button
              key={id}
              type="button"
              data-active={isActive}
              aria-pressed={isActive}
              aria-label={`Use ${label} mode`}
              hidden={compact && !open && id !== mode}
              onClick={() => handleClick(id)}
              className={cn(
                "relative grid min-h-[2.375rem] w-[2.625rem] place-items-center overflow-hidden border-l border-border text-muted transition-colors first:border-l-0 data-[active=true]:text-fg",
                compact && !open && "border-l-0",
              )}
              {...iconButtonMicroInteraction}
            >
              {isActive && (
                <motion.span
                  layoutId="mode-active"
                  className="absolute inset-1 rounded-sm bg-accent-soft shadow-[inset_0_-0.125rem_0_var(--accent)]"
                  transition={activeIndicatorTransition}
                  aria-hidden="true"
                />
              )}
              <Icon className="relative z-10 size-[1.0625rem] [stroke-width:1.8]" aria-hidden="true" />
            </motion.button>
          )
        })}
      </LayoutGroup>
    </div>
  )
}
