import type { PropsWithChildren } from "react"
import { motion, useReducedMotion } from "motion/react"

type SectionRevealProps = PropsWithChildren<{
  className?: string
  id?: string
}>

export function SectionReveal({ children, className, id }: SectionRevealProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.section
      id={id}
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 34 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}
