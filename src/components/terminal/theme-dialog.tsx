import type { ThemeName } from "@/hooks/use-terminal-theme"

import { useEffect, useRef, useState } from "react"
import { themes } from "@/hooks/use-terminal-theme"
import { cn } from "@/lib/utils"

type ThemeDialogProps = {
  theme: ThemeName
  onThemeChange: (theme: ThemeName) => void
}

/** Bottom-right settings launcher plus its modal theme picker. */
export function ThemeDialog({ theme, onThemeChange }: ThemeDialogProps) {
  const [open, setOpen] = useState(false)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement>(null)

  const activeLabel = themes.find(item => item.id === theme)?.label ?? theme

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
        {activeLabel}
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
            className="w-[min(30rem,100%)] overflow-hidden rounded-sm border-2 border-accent bg-panel shadow-[0_1.5rem_5rem_color-mix(in_oklch,black_45%,transparent)]"
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

            <div className="grid gap-4.5 p-3.5">
              <div className="grid gap-2">
                <div className="text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">theme</div>
                <div className="grid gap-2">
                  {themes.map((item) => {
                    const isActive = item.id === theme
                    return (
                      <button
                        key={item.id}
                        ref={isActive ? activeButtonRef : undefined}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => onThemeChange(item.id)}
                        className={cn(
                          "flex min-h-[2.375rem] items-center justify-start rounded-sm border border-border bg-surface px-2.5 text-left text-[0.8125rem]",
                          isActive && "border-line bg-accent-soft text-fg",
                        )}
                      >
                        {item.label}
                      </button>
                    )
                  })}
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
