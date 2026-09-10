"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"
import { duration, easing } from "@/lib/motion"

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.base, ease: easing.out }}
    >
      {children}
    </motion.div>
  )
}
