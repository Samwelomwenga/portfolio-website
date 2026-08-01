import type { HTMLMotionProps } from "motion/react"
import type { ReactNode } from "react"
import { motion } from "motion/react"

import { staggerContainer, staggerItem, viewport } from "@/lib/motion"

type StaggerTag = "div" | "ul" | "ol" | "section"

type StaggerProps = {
  children: ReactNode
  as?: StaggerTag
} & Omit<HTMLMotionProps<"div">, "children">

/**
 * Container that reveals its children one after another when it scrolls into
 * view. Children should be <StaggerItem> (or set the shared `hidden`/`visible`
 * variants) so the orchestration reaches them.
 */
export function Stagger({ children, as = "div", ...props }: StaggerProps) {
  const MotionTag = motion[as] as typeof motion.div
  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={staggerContainer}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

type StaggerItemTag = "div" | "li" | "article" | "p" | "span"

type StaggerItemProps = {
  children: ReactNode
  as?: StaggerItemTag
} & Omit<HTMLMotionProps<"div">, "children">

/** A child of <Stagger>; inherits the reveal timing from its parent. */
export function StaggerItem({ children, as = "div", ...props }: StaggerItemProps) {
  const MotionTag = motion[as] as typeof motion.div
  return (
    <MotionTag variants={staggerItem} {...props}>
      {children}
    </MotionTag>
  )
}
