import type { Variants } from "motion/react"
import { motion, useReducedMotion } from "motion/react"

import { duration, easing, stagger as staggerTokens, viewport } from "@/lib/motion"

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

/**
 * A "rolling text" reveal: each unit (character or word) sits behind a
 * one-line mask with a duplicate stacked directly below it, and rolls up in a
 * stagger — on hover, and optionally when it scrolls into view. Recreated from
 * free primitives (masking + `staggerChildren`), no Motion+ `splitText`.
 *
 * The mask's height comes from the first (in-flow) copy; the second copy is
 * absolutely positioned just below it, so it adds no height and stays clipped
 * until the roller translates a full -100%.
 *
 * Reduced-motion users get plain static text. The full string stays in the
 * accessibility tree; the rolling copies are `aria-hidden`.
 */
export function RollingText({
  text,
  split = "chars",
  revealOnView = false,
  driven = false,
  staggerEach,
  className,
}: RollingTextProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>
  }

  const each = staggerEach ?? (split === "words" ? staggerTokens.base : 0.03)
  // Keep whitespace as its own unit so word wrapping still happens between words.
  const units = (split === "words" ? text.split(SPLIT_ON_WHITESPACE) : [...text]).filter(unit => unit !== "")

  const containerVariants: Variants = {
    rest: { transition: { staggerChildren: each } },
    rolled: { transition: { staggerChildren: each } },
  }

  const selfProps = driven
    ? {}
    : {
        initial: revealOnView ? "rolled" : "rest",
        whileHover: "rolled",
        ...(revealOnView ? { whileInView: "rest", viewport } : {}),
      }

  return (
    <motion.span className={className} variants={containerVariants} aria-label={text} {...selfProps}>
      <span className="sr-only">{text}</span>
      {units.map((unit, index) =>
        isWhitespace(unit)
          ? (
              <span key={`${index}-space`} aria-hidden="true">{unit}</span>
            )
          : (
              <span key={`${index}-${unit}`} aria-hidden="true" className="relative inline-block overflow-hidden align-bottom">
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
