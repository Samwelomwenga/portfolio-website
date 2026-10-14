import type { Variants } from "motion/react"
import { motion, useReducedMotion } from "motion/react"

import { duration, easing, stagger as staggerTokens, viewport } from "@/lib/motion"
import { cn } from "@/lib/utils"

type RollingTextProps = {
  /** The text to roll. */
  text: string
  /** Split into per-character or per-word rolling units. Default `"chars"`. */
  split?: "chars" | "words"
  /** Also roll once when scrolled into view, not just on hover. */
  revealOnView?: boolean
  /**
   * Inherit the `rest`/`rolled` state from a parent motion element instead of
   * self-triggering. Use inside a button that already drives `whileHover`.
   */
  driven?: boolean
  /** Gap between successive units, in seconds. */
  staggerEach?: number
  /** Class on the inline container; colour/size are inherited by the copies. */
  className?: string
  /** Hide the duplicated visual text when an ancestor/sibling supplies the accessible label. */
  hideFromAccessibility?: boolean
}

// A plain ease (no spring overshoot) so the roll never overshoots past the
// second copy and flashes an empty gap beneath it.
const rollTransition = { duration: duration.base, ease: easing.out }

const rollItem: Variants = {
  rest: { y: "0%", transition: rollTransition },
  rolled: { y: "-100%", transition: rollTransition },
}

const WHITESPACE = /^\s+$/
const SPLIT_ON_WHITESPACE = /(\s+)/
const isWhitespace = (value: string) => WHITESPACE.test(value)

function splitIntoKeyedUnits(text: string, split: "chars" | "words") {
  const units = (split === "words" ? text.split(SPLIT_ON_WHITESPACE) : [...text]).filter(unit => unit !== "")
  const occurrenceCounts = new Map<string, number>()
  return units.map((unit) => {
    const occurrence = occurrenceCounts.get(unit) ?? 0
    occurrenceCounts.set(unit, occurrence + 1)
    return { unit, key: `${unit}:${occurrence}` }
  })
}

function rollWhileOutOfView(container: HTMLSpanElement) {
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => container.toggleAttribute("data-rolled", !entry.isIntersecting)),
    { threshold: viewport.amount },
  )
  observer.observe(container)
  return () => observer.disconnect()
}

export function RollingText(props: RollingTextProps) {
  return props.driven ? <DrivenRollingText {...props} /> : <CssRollingText {...props} />
}

function CssRollingText({
  text,
  split = "chars",
  revealOnView = false,
  staggerEach,
  className,
  hideFromAccessibility = false,
}: RollingTextProps) {
  const each = staggerEach ?? (split === "words" ? staggerTokens.base : 0.03)
  let rollIndex = 0

  return (
    <span
      ref={revealOnView ? rollWhileOutOfView : undefined}
      className={cn("group/roll", className)}
      data-rolled={revealOnView ? "" : undefined}
      aria-hidden={hideFromAccessibility || undefined}
      aria-label={hideFromAccessibility ? undefined : text}
    >
      {!hideFromAccessibility && <span className="sr-only">{text}</span>}
      {splitIntoKeyedUnits(text, split).map(({ unit, key }) => {
        if (isWhitespace(unit))
          return unit
        const delay = rollIndex++ * each
        return (
          <span key={key} className="relative inline-block overflow-hidden align-bottom">
            <span
              data-roll-unit
              data-text={unit}
              aria-hidden="true"
              style={{ transitionDelay: `${delay}s` }}
              className="block transition-transform duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] after:absolute after:left-0 after:top-full after:content-[attr(data-text)] motion-safe:group-hover/roll:-translate-y-full motion-safe:group-data-rolled/roll:-translate-y-full"
            >
              {unit}
            </span>
          </span>
        )
      })}
    </span>
  )
}

function DrivenRollingText({
  text,
  split = "chars",
  staggerEach,
  className,
  hideFromAccessibility = false,
}: RollingTextProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <span className={className} aria-hidden={hideFromAccessibility || undefined}>{text}</span>
  }

  const each = staggerEach ?? (split === "words" ? staggerTokens.base : 0.03)
  const containerVariants: Variants = {
    rest: { transition: { staggerChildren: each } },
    rolled: { transition: { staggerChildren: each } },
  }

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      aria-hidden={hideFromAccessibility || undefined}
      aria-label={hideFromAccessibility ? undefined : text}
    >
      {!hideFromAccessibility && <span className="sr-only">{text}</span>}
      {splitIntoKeyedUnits(text, split).map(({ unit, key }) =>
        isWhitespace(unit)
          ? (
              <span key={`${key}:space`} aria-hidden="true">{unit}</span>
            )
          : (
              <span key={key} aria-hidden="true" className="relative inline-block overflow-hidden align-bottom">
                <motion.span variants={rollItem} className="block">
                  <span className="block">{unit}</span>
                  <span className="absolute left-0 top-full block">{unit}</span>
                </motion.span>
              </span>
            ),
      )}
    </motion.span>
  )
}
