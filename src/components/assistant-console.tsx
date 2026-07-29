import { useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { StatusPill } from "@/components/terminal/status-pill"
import { cn } from "@/lib/utils"
import { assistantPrompts, assistantResponses, assistantSeedPrompt } from "@/portfolio-data"

const TYPE_INTERVAL_MS = 24

function responseFor(prompt: string): string {
  const lower = prompt.toLowerCase()
  if (lower.includes("recruiter")) {
    return assistantResponses.recruiter
  }
  if (lower.includes("react") || lower.includes("stack")) {
    return assistantResponses.stack
  }
  if (lower.includes("client")) {
    return assistantResponses.client
  }
  return assistantResponses.fallback
}

/**
 * A simulated personal-assistant console. Prompt chips and the compose box feed
 * canned, keyword-matched replies that "type" out — no backend involved.
 */
export function AssistantConsole() {
  const prefersReducedMotion = useReducedMotion()
  const [input, setInput] = useState(assistantSeedPrompt.toLowerCase())
  const [echo, setEcho] = useState(assistantSeedPrompt.toLowerCase())
  const [target, setTarget] = useState(() => responseFor(assistantSeedPrompt))
  const [typed, setTyped] = useState("")
  const timerRef = useRef<number | null>(null)

  function runAssistant(rawPrompt: string) {
    const clean = rawPrompt.trim() || assistantSeedPrompt
    setInput(clean)
    setEcho(clean)
    setTarget(responseFor(clean))
  }

  // Type the current target response character by character. When reduced
  // motion is preferred the full text is shown at once (derived below).
  useEffect(() => {
    if (!target || prefersReducedMotion) {
      return
    }

    // The first tick resets the text to empty, so no synchronous setState is
    // needed in the effect body.
    let index = 0
    timerRef.current = window.setInterval(() => {
      setTyped(target.slice(0, index))
      index += 1
      if (index > target.length && timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }, TYPE_INTERVAL_MS)

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [target, prefersReducedMotion])

  const shownTyped = prefersReducedMotion ? target : typed
  const shownReady = target !== "" && shownTyped === target

  return (
    <section
      aria-labelledby="assistant-console-title"
      className="grid max-h-[38.75rem] grid-rows-[auto_minmax(0,1fr)_auto_auto] overflow-hidden rounded-md border border-line bg-panel shadow-[0_1.5rem_5rem_color-mix(in_oklch,black_32%,transparent)] wide:max-h-[38.75rem]"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-surface/50 px-3.5 py-3">
        <div className="pixel-mark grid size-9 shrink-0 place-items-center rounded-sm border border-state-orange/60" aria-hidden="true">
          AI
        </div>
        <div className="grid min-w-0 flex-1 gap-0.5">
          <strong id="assistant-console-title" className="truncate text-[0.8125rem] tracking-[0.01em]">personal ai assistant</strong>
          <span className="truncate text-[0.6875rem] text-muted">portfolio helper · custom prompts</span>
        </div>
        <StatusPill tone="done">online</StatusPill>
      </div>

      <div className="grid min-h-[17.5rem] content-start gap-3 overflow-auto p-3.5 text-[0.8125rem] leading-relaxed term-scrollbar" aria-live="polite">
        <div className="grid grid-cols-[1.125rem_minmax(0,1fr)] gap-2 text-muted">
          <span className="font-black text-accent">›</span>
          <p className="min-w-0">{echo}</p>
        </div>
        <div className="grid grid-cols-[1.125rem_minmax(0,1fr)] gap-2 text-muted">
          <span className="mt-2 size-2 rounded-full bg-state-orange shadow-[0_0_0_0.25rem_color-mix(in_oklch,var(--state-orange)_18%,transparent)]" aria-hidden="true" />
          <p className="min-w-0">
            <strong className="mb-0.5 block text-xs tracking-[0.08em] text-fg uppercase">Assistant</strong>
            <span className="typed-caret text-muted">{shownTyped}</span>
          </p>
        </div>
        <div
          className={cn(
            "status-pulse flex items-center gap-2 pt-0.5 text-xs",
            shownReady ? "text-success" : "text-warn",
          )}
          data-ready={shownReady}
        >
          {shownReady ? "Ready for next prompt" : "Working"}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border bg-surface/40 px-3.5 pb-3">
        {assistantPrompts.map(chip => (
          <button
            key={chip.label}
            type="button"
            onClick={() => runAssistant(chip.prompt)}
            className="mt-3 min-h-8 rounded-sm border border-border bg-surface px-2.5 text-[0.6875rem] font-extrabold tracking-[0.02em] text-muted transition-colors hover:border-line hover:text-fg"
          >
            {chip.label}
          </button>
        ))}
      </div>

      <form
        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-t border-border bg-panel px-3.5 py-3"
        onSubmit={(event) => {
          event.preventDefault()
          runAssistant(input)
        }}
      >
        <span className="font-black text-accent">›</span>
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          type="text"
          autoComplete="off"
          placeholder="Ask the portfolio assistant..."
          aria-label="Ask the portfolio assistant"
          className="min-h-[2.375rem] w-full rounded-sm border border-border bg-surface px-2.5 text-xs text-fg outline-none focus:border-line focus:shadow-[0_0_0_0.125rem_color-mix(in_oklch,var(--accent)_24%,transparent)]"
        />
        <button
          type="submit"
          className="min-h-[2.375rem] rounded-sm border border-accent bg-accent px-3 text-xs font-black tracking-[0.02em] text-[color:var(--bg)]"
        >
          run
        </button>
      </form>
    </section>
  )
}
