import type { Certification } from "@/portfolio-data"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import { pillMicroInteraction, staggerItem } from "@/lib/motion"
import { cn } from "@/lib/utils"

const certPillClass = "group/cert inline-flex min-h-12 max-w-full items-center gap-2 rounded-sm border border-border bg-surface py-1.5 pr-2.5 pl-1.5 text-xs font-bold text-fg"

function CertificationBadge({ certification }: { certification: Certification }) {
  if (!certification.imageSrc) {
    return null
  }

  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-white p-1">
      <Image
        src={certification.imageSrc}
        alt=""
        width={28}
        height={28}
        aria-hidden="true"
        className="size-full object-contain"
      />
    </span>
  )
}

export function CertificationPill({ certification }: { certification: Certification }) {
  if (!certification.href) {
    return (
      <motion.li
        variants={staggerItem}
        whileHover={pillMicroInteraction.whileHover}
        whileTap={pillMicroInteraction.whileTap}
        transition={pillMicroInteraction.transition}
        className={certPillClass}
      >
        <CertificationBadge certification={certification} />
        <span className="min-w-0 leading-snug">{certification.name}</span>
      </motion.li>
    )
  }

  return (
    <motion.li variants={staggerItem}>
      <motion.a
        href={certification.href}
        target="_blank"
        rel="noreferrer"
        whileHover={pillMicroInteraction.whileHover}
        whileTap={pillMicroInteraction.whileTap}
        transition={pillMicroInteraction.transition}
        className={cn(certPillClass, "transition-colors hover:border-fg")}
      >
        <CertificationBadge certification={certification} />
        <span className="min-w-0 leading-snug">{certification.name}</span>
        <ArrowUpRight className="size-3.5 shrink-0 text-muted transition-colors group-hover/cert:text-fg" aria-hidden="true" />
      </motion.a>
    </motion.li>
  )
}
