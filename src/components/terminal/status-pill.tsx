import type { ComponentProps } from "react"

import type { StatusTone } from "@/portfolio-data"
import { cn } from "@/lib/utils"

const toneClass: Record<StatusTone, string> = {
  default: "text-muted border-border",
  done: "text-success border-success/45",
  warn: "text-warn border-warn/45",
}

type StatusPillProps = {
  tone?: StatusTone
} & ComponentProps<"span">

/** Compact terminal chip used for project/blog states and inline actions. */
export function StatusPill({ tone = "default", className, ...props }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center justify-center rounded-sm border px-2 text-[0.6875rem] font-extrabold tracking-[0.02em]",
        toneClass[tone],
        className,
      )}
      {...props}
    />
  )
}
