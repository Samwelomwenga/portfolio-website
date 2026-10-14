"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"
import { useSyncExternalStore } from "react"
import { duration, easing } from "@/lib/motion"

const subscribe = () => () => {}

function useHasHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}

export default function Template({ children }: { children: ReactNode }) {
  const hasHydrated = useHasHydrated()

  return (
    <motion.div
      initial={hasHydrated ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.base, ease: easing.out }}
    >
      {children}
    </motion.div>
  )
}
