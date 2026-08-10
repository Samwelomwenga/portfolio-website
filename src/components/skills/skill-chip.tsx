import { motion } from "motion/react"
import { staggerItem } from "@/lib/motion"
import { skillIcons } from "@/lib/skill-icons"
import { cn } from "@/lib/utils"

type SkillChipProps = {
  tag: string
}

export function SkillChip({ tag }: SkillChipProps) {
  const icon = skillIcons[tag]

  return (
    <motion.li variants={staggerItem} data-skill={tag} className="inline-flex min-h-8 items-center gap-1.5 rounded-sm border border-border bg-surface py-1 pr-2.5 pl-1 text-xs font-bold text-fg">
      {icon && (
        <span className="grid size-5 shrink-0 place-items-center rounded-sm bg-white/95">
          <icon.Icon aria-hidden="true" className={cn("size-3.5", icon.iconClass)} focusable="false" title="" />
        </span>
      )}
      <span>{tag}</span>
    </motion.li>
  )
}
