import type { ColorMode, EffectiveMode, ThemeName } from "@/hooks/use-terminal-theme"

import { useEffect, useRef, useState } from "react"
import { getThemeOption, themeOptions } from "@/hooks/use-terminal-theme"
import { cn } from "@/lib/utils"

type ThemeDialogProps = {
  theme: ThemeName
  effectiveMode: EffectiveMode
  onThemeChange: (theme: ThemeName) => void
  onModeChange: (mode: ColorMode) => void
}

/** Bottom-right settings launcher plus its modal theme picker. */
export function ThemeDialog({ theme, effectiveMode, onThemeChange, onModeChange }: ThemeDialogProps) {
  const [open, setOpen] = useState(false)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement>(null)

  const activeOption = getThemeOption(theme, effectiveMode)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const targetTag = (event.target as HTMLElement | null)?.tagName
      const isTyping = targetTag === "INPUT" || targetTag === "TEXTAREA" || (event.target as HTMLElement | null)?.isContentEditable

      if (!isTyping && (event.key === "/" || event.key.toLowerCase() === "t")) {
        event.preventDefault()
        setOpen(previous => !previous)
      }
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      activeButtonRef.current?.focus()
    }
    else {
      launcherRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="fixed right-2 bottom-4 left-2 z-40 inline-flex min-h-[2.375rem] items-center justify-center gap-2 rounded-md border border-line bg-base/90 px-3 text-xs font-extrabold tracking-[0.02em] text-muted backdrop-blur-md transition-colors hover:border-accent hover:text-fg sm:right-4 sm:left-auto sm:justify-start"
      >
        <span className="theme-spectrum-dot size-[0.5625rem] rounded-full" aria-hidden="true" />
        {activeOption.label}
        {" "}
        [/]
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-[color-mix(in_oklch,black_28%,transparent)] p-4.5 backdrop-blur-[2px]"
          onClick={event => event.target === event.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Theme settings"
            className="grid max-h-[calc(100svh-2rem)] w-[min(30rem,100%)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-sm border-2 border-accent bg-panel shadow-[0_1.5rem_5rem_color-mix(in_oklch,black_45%,transparent)]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-3.5 py-3">
              <div className="text-[0.8125rem] font-extrabold tracking-[0.02em]">theme</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close theme settings"
                className="size-[2.125rem] rounded-sm border border-border bg-surface text-fg"
              >
                x
              </button>
            </div>

            <div data-theme-list className="min-h-0 overflow-y-auto overscroll-contain p-3.5 term-scrollbar">
              <div className="grid gap-2">
                <div className="text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">theme</div>
                <div className="grid gap-2">
                  {(["dark", "light"] as const).map(group => (
                    <div key={group} className="grid gap-1.5">
                      <div className="px-1 text-[0.625rem] font-extrabold tracking-[0.08em] text-muted uppercase">{group}</div>
                      {themeOptions.filter(item => item.mode === group).map((item) => {
                        const isActive = item.id === activeOption.id
                        return (
                          <button
                            key={item.id}
                            ref={isActive ? activeButtonRef : undefined}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => {
                              onThemeChange(item.theme)
                              onModeChange(item.mode)
                            }}
                            className={cn(
                              "grid min-h-[2.375rem] grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-sm border border-border bg-surface px-2.5 text-left text-[0.8125rem]",
                              isActive && "border-line bg-accent-soft text-fg",
                            )}
                          >
                            <span className="flex gap-1" aria-hidden="true">
                              {item.swatches.map(color => (
                                <span key={color} className="size-2 rounded-full border border-border" style={{ backgroundColor: color }} />
                              ))}
                            </span>
                            <span className="truncate">{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border px-3.5 py-3 text-xs text-muted">
              <span>t or / opens theme</span>
              <span>esc closes</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
