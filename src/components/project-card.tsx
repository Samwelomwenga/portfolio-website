import type { ProjectItem } from "@/portfolio-data"
import { StatusPill } from "@/components/terminal/status-pill"
import { stateStyle } from "@/lib/utils"

type ProjectCardProps = {
  project: ProjectItem
}

/** Project pane: browser-framed screenshot well over a metadata body. */
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      style={stateStyle(project.state)}
      className="grid grid-rows-[auto_1fr] overflow-hidden rounded-md border border-border bg-surface"
    >
      <div
        className="border-t-4 border-t-[color:var(--card-accent)] border-b border-b-border p-3.5"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklch, var(--card-accent) 10%, transparent), transparent 42%), var(--panel)",
        }}
      >
        <div className="grid min-h-[11.875rem] grid-rows-[1.75rem_minmax(0,1fr)] overflow-hidden rounded-md border border-border bg-shell">
          <div className="flex items-center gap-1.5 border-b border-border bg-surface/80 px-2.5">
            <span className="size-[0.4375rem] rounded-full bg-state-yellow" />
            <span className="size-[0.4375rem] rounded-full bg-state-pink" />
            <span className="size-[0.4375rem] rounded-full bg-state-green" />
          </div>
          <div
            className="grid min-h-[10.125rem] place-items-center border border-dashed text-[0.75rem] font-extrabold tracking-[0.08em] text-muted uppercase"
            style={{
              borderColor: "color-mix(in oklch, var(--card-accent) 44%, var(--border))",
              background:
                "linear-gradient(135deg, color-mix(in oklch, var(--card-accent) 12%, transparent), transparent 48%), repeating-linear-gradient(0deg, transparent 0 1.0625rem, color-mix(in oklch, var(--border) 36%, transparent) 1.125rem 1.1875rem)",
            }}
          >
            project screenshot
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          <StatusPill tone={project.statusTone}>{project.statusLabel}</StatusPill>
          <StatusPill>{project.typeLabel}</StatusPill>
        </div>
        <h3 className="text-xl leading-tight tracking-[-0.03em]">{project.title}</h3>
        <p className="text-sm text-muted">{project.blurb}</p>
      </div>
    </article>
  )
}
