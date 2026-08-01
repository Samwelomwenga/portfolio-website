import type { HTMLMotionProps } from "motion/react"
import type { ReactNode } from "react"
import { motion } from "motion/react"

import { makeStaggerContainer, staggerContainer, staggerItem, viewport } from "@/lib/motion"

type StaggerTag = "div" | "ul" | "ol" | "section"

type StaggerProps = {
  children: ReactNode
  as?: StaggerTag
  /**
   * When the reveal fires. `"in-view"` (default) waits for the container to
   * scroll into view; `"load"` plays immediately on mount, for above-the-fold
   * content that never receives a scroll trigger.
   */
  trigger?: "in-view" | "load"
  /** Delay before the group starts, in seconds. Offsets an on-load tail. */
  delay?: number
  /**
   * Gap between successive children, in seconds. Defaults to `stagger.base`.
   * Pass `stagger.tight` for dense groups (e.g. skill chips) so the last child
   * doesn't wait past the ~0.4s budget (guardrail 02-C).
   */
  each?: number
} & Omit<HTMLMotionProps<"div">, "children">

/**
 * Container that reveals its children one after another. By default it waits
 * until it scrolls into view; pass `trigger="load"` for above-the-fold content
 * so it enters on mount. Children should be <StaggerItem> (or set the shared
 * `hidden`/`visible` variants) so the orchestration reaches them.
 */
export function Stagger({ children, as = "div", trigger = "in-view", delay, each, ...props }: StaggerProps) {
  const MotionTag = motion[as] as typeof motion.div
  const revealProps = trigger === "load"
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport }
  const variants = delay === undefined && each === undefined
    ? staggerContainer
    : makeStaggerContainer(delay, each)
  return (
    <MotionTag
      initial="hidden"
      {...revealProps}
      variants={variants}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

type StaggerItemTag = "div" | "li" | "article" | "p" | "span" | "h1"

type StaggerItemProps = {
  children: ReactNode
  as?: StaggerItemTag
} & Omit<HTMLMotionProps<"div">, "children">

/**
 * A child of <Stagger>; inherits the reveal timing from its parent. Defaults to
 * the shared fade+rise variant, but pass `variants` (still keyed
 * `hidden`/`visible`) to swap in another reveal, e.g. `maskLine`.
 */
export function StaggerItem({ children, as = "div", variants = staggerItem, ...props }: StaggerItemProps) {
  const MotionTag = motion[as] as typeof motion.div
  return (
    <MotionTag variants={variants} {...props}>
      {children}
    </MotionTag>
  )
}
