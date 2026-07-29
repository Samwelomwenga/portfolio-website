import type { LucideIcon } from "lucide-react"
import type { ReactNode, RefObject } from "react"
import type { ColorMode, ThemeName } from "@/hooks/use-terminal-theme"

import type { SectionId } from "@/portfolio-data"
import { Monitor, Moon, Sun } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ThemeDialog } from "@/components/terminal/theme-dialog"
import { cn } from "@/lib/utils"
import { navItems, profile, socialLinks } from "@/portfolio-data"

const modeOptions: { id: ColorMode, icon: LucideIcon, label: string }[] = [
  { id: "dark", icon: Moon, label: "dark" },
  { id: "light", icon: Sun, label: "light" },
  { id: "auto", icon: Monitor, label: "auto" },
]

type TerminalFrameProps = {
  theme: ThemeName
  mode: ColorMode
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
        href="#terminal-scroll"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2.5 focus:left-2.5 focus:z-[100] focus:rounded-sm focus:border focus:border-border focus:bg-surface focus:px-2.5 focus:py-2 focus:text-xs"
      >
        Skip to portfolio
      </a>

      <div className="grid h-[100svh] grid-cols-1 wide:grid-cols-[minmax(14.375rem,18.75rem)_minmax(0,1fr)]">
        <Sidebar activeId={activeId} onNavigate={onNavigate} />

        <section className="grid min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-panel" aria-label="Portfolio terminal">
          <TabBar activeId={activeId} mode={mode} onNavigate={onNavigate} onModeChange={onModeChange} />
          <div id="terminal-scroll" ref={scrollRef} className="min-h-0 overflow-auto scroll-pt-6 term-scrollbar">
            {children}
          </div>
        </section>
      </div>

      <ThemeDialog theme={theme} onThemeChange={onThemeChange} />
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
          <strong className="text-[clamp(1.375rem,4vw,1.75rem)] leading-tight tracking-[-0.02em]">{profile.name}</strong>
          <span className="text-xs break-words text-muted">{profile.workspaceMeta}</span>
        </div>
      </div>

      <nav className="min-h-0 overflow-auto p-2 term-scrollbar" aria-label="Portfolio sections">
        <div className="mb-3">
          <div className="px-2 py-1.5 text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">pages</div>
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
        </div>

        <div>
          <div className="px-2 py-1.5 text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">socials</div>
          {socialLinks.map(link => (
            <TreeLink key={link.label} state={link.state} main={link.label} meta={link.meta} href={link.href} suffix="open" />
          ))}
        </div>
      </nav>
    </aside>
  )
}

type TreeLinkProps = {
  state: string
  main: string
  meta: string
  active?: boolean
  href?: string
  suffix?: string
  onClick?: () => void
}

function TreeLink({ state, main, meta, active, href, suffix, onClick }: TreeLinkProps) {
  const className = cn(
    "grid min-h-12 w-full items-center gap-x-2 gap-y-px rounded-sm px-2 py-1.5 text-left text-muted transition-colors hover:bg-surface/85 hover:text-fg data-[active=true]:bg-surface/85 data-[active=true]:text-fg",
    suffix ? "grid-cols-[0.625rem_minmax(0,1fr)_auto]" : "grid-cols-[0.625rem_minmax(0,1fr)]",
  )

  const dot = (
    <span
      aria-hidden="true"
      className="row-span-2 mt-2 size-2 self-start rounded-full"
      style={{ background: `var(--state-${state})` }}
    />
  )
  const body = (
    <>
      <span className="col-start-2 truncate text-[0.8125rem] leading-tight font-extrabold tracking-[-0.01em] text-fg">{main}</span>
      <span className="col-start-2 truncate text-[0.6875rem] leading-tight text-muted">{meta}</span>
      {suffix && <span className="col-start-3 row-span-2 self-center text-[0.6875rem] text-muted">{suffix}</span>}
    </>
  )

  if (href) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {dot}
        {body}
      </a>
    )
  }

  return (
    <button type="button" className={className} data-active={active} aria-current={active ? "page" : undefined} onClick={onClick}>
      {dot}
      {body}
    </button>
  )
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
        {navItems.map(item => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === activeId}
            data-active={item.id === activeId}
            onClick={() => onNavigate(item.id)}
            className="min-h-[2.375rem] min-w-[6.75rem] shrink-0 border-r border-border px-3.5 text-left text-xs font-bold tracking-[0.02em] text-muted transition-colors data-[active=true]:bg-accent data-[active=true]:text-[color:var(--bg)]"
          >
            {item.tab}
          </button>
        ))}
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
      {modeOptions.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          data-active={id === mode}
          aria-pressed={id === mode}
          aria-label={`Use ${label} mode`}
          hidden={compact && !open && id !== mode}
          onClick={() => handleClick(id)}
          className={cn(
            "relative grid min-h-[2.375rem] w-[2.625rem] place-items-center border-l border-border text-muted transition-colors first:border-l-0 data-[active=true]:bg-accent-soft data-[active=true]:text-fg data-[active=true]:shadow-[inset_0_-0.125rem_0_var(--accent)]",
            compact && !open && "border-l-0",
          )}
        >
          <Icon className="size-[1.0625rem]" strokeWidth={1.8} aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
