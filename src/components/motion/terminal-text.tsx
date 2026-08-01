import { useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

type TerminalTextProps = {
  /** The full string to type out. */
  text: string
  /** Milliseconds per character. */
  speed?: number
  /** Delay before typing starts, in ms. */
  startDelay?: number
  /** Show the blinking block caret while/after typing. */
  caret?: boolean
  className?: string
}

/**
 * Terminal-native typewriter: reveals `text` character by character with an
 * optional blinking caret (`.typed-caret` in index.css). Reduced-motion users
 * get the full text immediately with no typing. The full string is always in
 * the accessibility tree via a visually-hidden copy, so screen readers never
 * see a half-typed line.
 */
export function TerminalText({ text, speed = 24, startDelay = 0, caret = true, className }: TerminalTextProps) {
  const prefersReducedMotion = useReducedMotion()
  const [typed, setTyped] = useState("")

  // Type the text out character by character. The first interval tick sets the
  // slice to "" (resetting on a text change), so no synchronous setState in the
  // effect body is needed. Reduced-motion users skip typing entirely (derived
  // below), matching the AssistantConsole pattern.
  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    let index = 0
    let intervalId: number | null = null
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setTyped(text.slice(0, index))
        index += 1
        if (index > text.length && intervalId) {
          window.clearInterval(intervalId)
          intervalId = null
        }
      }, speed)
    }, startDelay)

    return () => {
      window.clearTimeout(startId)
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [text, speed, startDelay, prefersReducedMotion])

  const shown = prefersReducedMotion ? text : typed
  const done = shown === text

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={cn(caret && !done && "typed-caret")}>
        {shown}
      </span>
    </span>
  )
}
