import type { Variants } from "motion/react"
import type { EffectiveMode, ThemeName, ThemeOption } from "@/hooks/use-terminal-theme"

import { X } from "lucide-react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { getThemeOption, themeOptions } from "@/hooks/use-terminal-theme"
import { activeIndicatorTransition, buttonMicroInteraction, duration, easing, iconButtonMicroInteraction, pillMicroInteraction, stagger } from "@/lib/motion"
import { cn } from "@/lib/utils"

type ThemeDialogProps = {
  theme: ThemeName
  effectiveMode: EffectiveMode
  transitioning: boolean
  onThemeOptionChange: (option: ThemeOption) => void
}

const themeListVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.14,
      staggerChildren: stagger.tight,
    },
  },
}

const themeOptionVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.fast, ease: easing.out },
  },
}

/** Bottom-right settings launcher plus its modal theme picker. */
export function ThemeDialog({ theme, effectiveMode, transitioning, onThemeOptionChange }: ThemeDialogProps) {
  const [open, setOpen] = useState(false)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement>(null)

  const activeOption = getThemeOption(theme, effectiveMode)
  const effectiveModeLabel = `${effectiveMode} mode`

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
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="fixed right-2 bottom-4 left-2 z-40 inline-flex min-h-[2.375rem] items-center justify-center gap-2 rounded-md border border-line bg-base/90 px-3 text-xs font-extrabold tracking-[0.02em] text-muted backdrop-blur-md transition-colors hover:border-accent hover:text-fg sm:right-4 sm:left-auto sm:justify-start"
        {...buttonMicroInteraction}
      >
        <motion.span className="theme-spectrum-dot size-[0.5625rem] shrink-0 rounded-full" aria-hidden="true" layout />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={activeOption.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: duration.fast, ease: easing.out }}
          >
            {activeOption.label}
          </motion.span>
        </AnimatePresence>
        {" "}
        [/]
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-[color-mix(in_oklch,black_28%,transparent)] p-4.5 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast, ease: easing.out }}
            onClick={event => event.target === event.currentTarget && setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Theme settings"
              className="grid max-h-[calc(100svh-2rem)] w-[min(30rem,100%)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-sm border-2 border-accent bg-panel shadow-[0_1.5rem_5rem_color-mix(in_oklch,black_45%,transparent)]"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: duration.base, ease: easing.out }}
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-3.5 py-3">
                <div className="text-[0.8125rem] font-extrabold tracking-[0.02em]">theme</div>
                <motion.button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close theme settings"
                  className="grid size-[2.125rem] place-items-center rounded-sm border border-border bg-surface text-fg transition-colors hover:border-line"
                  {...iconButtonMicroInteraction}
                >
                  <X className="size-4 [stroke-width:2]" aria-hidden="true" />
                </motion.button>
              </div>

              <div data-theme-list className="min-h-0 overflow-y-auto overscroll-contain p-3.5 term-scrollbar" aria-busy={transitioning}>
                <motion.div
                  className="grid gap-2"
                  variants={themeListVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">theme</div>
                  <LayoutGroup id="theme-options">
                    <div className="grid gap-2">
                      {(["dark", "light"] as const).map(group => (
                        <div key={group} className="grid gap-1.5">
                          <div className="px-1 text-[0.625rem] font-extrabold tracking-[0.08em] text-muted uppercase">{group}</div>
                          {themeOptions.filter(item => item.mode === group).map((item) => {
                            const isActive = item.id === activeOption.id
                            return (
                              <motion.div key={item.id} variants={themeOptionVariants}>
                                <motion.button
                                  ref={isActive ? activeButtonRef : undefined}
                                  type="button"
                                  aria-pressed={isActive}
                                  disabled={transitioning}
                                  onClick={() => onThemeOptionChange(item)}
                                  className={cn(
                                    "relative grid min-h-[2.375rem] w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-2 overflow-hidden rounded-sm border border-border bg-surface px-2.5 text-left text-[0.8125rem] transition-colors hover:border-line hover:text-fg disabled:cursor-wait disabled:opacity-65",
                                    isActive && "border-line text-fg",
                                  )}
                                  {...pillMicroInteraction}
                                >
                                  {isActive && (
                                    <motion.span
                                      layoutId="theme-active"
                                      className="absolute inset-0 rounded-sm bg-accent-soft"
                                      transition={activeIndicatorTransition}
                                      aria-hidden="true"
                                    />
                                  )}
                                  <span className="relative z-10 flex gap-1" aria-hidden="true">
                                    {item.swatches.map(color => (
                                      <span key={color} className="size-2 rounded-full border border-border" style={{ backgroundColor: color }} />
                                    ))}
                                  </span>
                                  <span className="relative z-10 truncate">{item.label}</span>
                                </motion.button>
                              </motion.div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </LayoutGroup>
                </motion.div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border px-3.5 py-3 text-xs text-muted">
                <span>{activeOption.label}</span>
                <span>{effectiveModeLabel}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
