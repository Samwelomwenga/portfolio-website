import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import { linkMicroInteraction } from "@/lib/motion"

type ArchiveLinkProps = {
  children: ReactNode
  onClick: () => void
}

export function ArchiveLink({ children, onClick }: ArchiveLinkProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="inline-flex w-max items-center gap-1 text-[0.8125rem] font-extrabold whitespace-nowrap text-state-orange"
      {...linkMicroInteraction}
    >
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </motion.button>
  )
}
