import type { ReactNode } from "react"
import type { SectionId } from "@/portfolio-data"
import { PromptLine } from "@/components/terminal/prompt-line"
import { commandFor } from "@/lib/sections"

type ScreenProps = {
  id: SectionId
  children: ReactNode
}

export function Screen({ id, children }: ScreenProps) {
  return (
    <section
      id={`screen-${id}`}
      data-section={id}
      aria-labelledby={`screen-${id}-title`}
      className="relative grid content-start gap-5 border-b border-border p-[clamp(1.25rem,4vw,2.75rem)] scroll-mt-5 last:border-b-0 wide:min-h-[calc(100svh-2.375rem)]"
    >
      <PromptLine section={id} command={commandFor(id)} />
      {children}
    </section>
  )
}

type SectionHeadingProps = {
  title: string
  headingId?: string
  children?: ReactNode
}

export function SectionHeading({ title, headingId, children }: SectionHeadingProps) {
  return (
    <div className="grid max-w-[48.75rem] gap-2">
      <h2 id={headingId} className="text-[clamp(1.75rem,5vw,2.875rem)] leading-tight text-balance">{title}</h2>
      {children && <p className="max-w-[65ch] text-base text-muted">{children}</p>}
    </div>
  )
}
