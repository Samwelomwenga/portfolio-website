import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { linkMicroInteraction } from "@/lib/motion"

type ArchiveLinkProps = {
  children: ReactNode
  href: string
}

const MotionLink = motion.create(Link)

export function ArchiveLink({ children, href }: ArchiveLinkProps) {
  return (
    <MotionLink
      href={href}
      className="inline-flex w-max items-center gap-1 text-[0.8125rem] font-extrabold whitespace-nowrap text-state-orange"
      {...linkMicroInteraction}
    >
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </MotionLink>
  )
}
