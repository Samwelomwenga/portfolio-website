import type { ReactNode } from "react"

import type { StateColor } from "@/portfolio-data"
import { cn, stateStyle } from "@/lib/utils"

type NoteCardProps = {
  state: StateColor
  kicker?: string
  title?: string
  className?: string
  children?: ReactNode
}

/** Accent-topped terminal card: a colored top rule, kicker, title, and body. */
export function NoteCard({ state, kicker, title, className, children }: NoteCardProps) {
  return (
    <article
      style={stateStyle(state)}
      className={cn(
        "relative overflow-hidden rounded-md border border-border border-t-4 border-t-[color:var(--card-accent)] bg-surface p-5.5",
        className,
      )}
    >
      {kicker && (
        <span className="mb-4 block text-[0.6875rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--card-accent)]">
          {kicker}
        </span>
      )}
      {title && (
        <h3 className="mb-2.5 text-sm leading-tight font-bold tracking-[-0.02em]">{title}</h3>
      )}
      {children}
    </article>
  )
}
