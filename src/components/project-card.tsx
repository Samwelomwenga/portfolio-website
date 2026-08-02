import type { ProjectItem } from "@/portfolio-data"
import { RollingText } from "@/components/motion/rolling-text"
import { StatusPill } from "@/components/terminal/status-pill"
import { cn, stateAccentClass } from "@/lib/utils"

type ProjectCardProps = {
  project: ProjectItem
}

/**
 * Project pane: browser-framed screenshot well over a metadata body. Wrapped by
 * <TiltCard> in the grid, so it reveals via the shared `cardReveal` variant and
 * leans toward the pointer on hover (chip/card grid archetype, ticket 07 —
 * mirrors the Skills section). The blurb rolls in word by word.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className={cn(
        stateAccentClass(project.state),
        "grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-md border border-border bg-surface",
      )}
    >
      <div className="project-preview-header border-t-4 border-t-[color:var(--card-accent)] border-b border-b-border p-3.5">
        <div className="grid min-h-[11.875rem] grid-rows-[1.75rem_minmax(0,1fr)] overflow-hidden rounded-md border border-border bg-shell">
          <div className="flex items-center gap-1.5 border-b border-border bg-surface/80 px-2.5">
            <span className="size-[0.4375rem] rounded-full bg-state-yellow" />
            <span className="size-[0.4375rem] rounded-full bg-state-pink" />
            <span className="size-[0.4375rem] rounded-full bg-state-green" />
          </div>
          <div className="project-preview-placeholder grid min-h-[10.125rem] place-items-center border border-dashed text-[0.75rem] font-extrabold tracking-[0.08em] text-muted uppercase">
            project screenshot
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          <StatusPill tone={project.statusTone}>{project.statusLabel}</StatusPill>
          <StatusPill>{project.typeLabel}</StatusPill>
        </div>
        <h3 className="text-xl leading-tight">{project.title}</h3>
        <p className="text-sm text-muted">
          <RollingText text={project.blurb} split="words" />
        </p>
      </div>
    </article>
  )
}
