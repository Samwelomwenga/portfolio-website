import type { ReactNode } from "react"
import { motion } from "motion/react"
import { buttonMicroInteraction } from "@/lib/motion"
import { cn } from "@/lib/utils"

type ActionButtonProps = {
  children: ReactNode
  primary?: boolean
  onClick: () => void
}

export function ActionButton({ children, primary, onClick }: ActionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[2.375rem] items-center justify-center gap-2 rounded-sm border px-3 text-xs font-extrabold tracking-[0.02em]",
        primary
          ? "border-accent bg-accent text-[color:var(--bg)]"
          : "border-border bg-surface text-fg hover:border-line",
      )}
      {...buttonMicroInteraction}
    >
      {children}
    </motion.button>
  )
}
