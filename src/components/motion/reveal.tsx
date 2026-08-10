import type { HTMLMotionProps } from "motion/react"
import type { ReactNode } from "react"
import { motion } from "motion/react"

import { duration, easing, viewport } from "@/lib/motion"

type RevealTag = "div" | "section" | "article" | "li" | "span" | "p"

type RevealProps = {
  children: ReactNode
  /** Element to render. Defaults to `div`. */
  as?: RevealTag
  /** Rise distance in px. Defaults to 16. */
  y?: number
  /** Delay before the reveal starts, in seconds. */
  delay?: number
  /** Entrance duration in seconds. Defaults to `duration.base`. */
  duration?: number
} & Omit<HTMLMotionProps<"div">, "children">

/**
 * Scroll-triggered entrance for a single block: fades + rises into view once.
 * Movement is dropped automatically for reduced-motion users (opacity is kept)
 * by the root <MotionConfig reducedMotion="user">.
 */
export function Reveal({ children, as = "div", y = 16, delay = 0, duration: durationSeconds = duration.base, ...props }: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div
  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: durationSeconds, ease: easing.out, delay },
        },
      }}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
