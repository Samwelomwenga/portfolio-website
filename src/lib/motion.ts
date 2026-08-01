import type { Transition, Variants } from "motion/react"

/**
 * Shared motion design language for the portfolio. Section animations build on
 * these tokens and the primitives in `components/motion/` so motion stays
 * coherent across sections while still allowing per-section character.
 *
 * Guardrails (see .scratch/section-animations/issues/02):
 * - animate transform + opacity only, no layout-affecting props per frame
 * - scroll reveals fire once, ~20% in view
 * - reduced motion is handled globally by <MotionConfig reducedMotion="user">
 *   at the app root, which keeps opacity fades but drops movement.
 */

/** Entrance/transition durations, in seconds. */
export const duration = {
  fast: 0.2,
  base: 0.32,
  slow: 0.5,
} as const

export const easing = {
  /** Gentle decelerate — the default entrance curve. */
  out: [0.22, 1, 0.36, 1],
  /** Symmetric in-out for reversible/looping transitions. */
  inOut: [0.65, 0, 0.35, 1],
} satisfies Record<string, [number, number, number, number]>

export const spring = {
  /** Soft settle for hovers and small UI moves. */
  soft: { type: "spring", bounce: 0.2, visualDuration: 0.4 },
  /** Snappier press/tap feedback. */
  snappy: { type: "spring", bounce: 0.24, visualDuration: 0.26 },
} satisfies Record<string, Transition>

/** Delay between staggered children, in seconds. */
export const stagger = {
  base: 0.06,
  tight: 0.04,
} as const

/**
 * Default scroll-reveal viewport. `once` keeps reveals from replaying and
 * `amount` triggers slightly before the element is fully on screen.
 */
export const viewport = { once: true, amount: 0.2 } as const

const entrance: Transition = { duration: duration.base, ease: easing.out }

/** A single element fading + rising into place. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: entrance },
}

/** Container that orchestrates a staggered reveal of its children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger.base, delayChildren: 0.05 },
  },
}

/** Child of `staggerContainer`; inherits the `hidden`/`visible` state by name. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: entrance },
}
