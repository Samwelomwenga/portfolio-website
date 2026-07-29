import type { ExperienceItem } from "@/portfolio-data"
import { stateStyle } from "@/lib/utils"

type ExperienceTimelineProps = {
  items: readonly ExperienceItem[]
}

/** Company · marker · role timeline, stacked on mobile and three-column wide. */
export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  return (
    <div className="grid gap-5">
      {items.map((item, index) => (
        <article
          key={`${item.company}-${item.role}`}
          style={stateStyle(item.state)}
          className="grid min-h-[5.5rem] items-start gap-x-3 gap-y-1.5 [grid-template-columns:1.75rem_minmax(0,1fr)] wide:gap-[clamp(1rem,2.5vw,1.75rem)] wide:[grid-template-columns:minmax(9.5rem,0.4fr)_2.75rem_minmax(0,1fr)]"
        >
          <div className="col-start-2 row-start-1 grid gap-1 wide:col-start-1">
            <strong className="text-base leading-tight tracking-[-0.02em]">{item.company}</strong>
            <time className="text-[0.6875rem] tracking-[0.01em] text-muted">{item.period}</time>
          </div>

          <div className="relative col-start-1 row-span-2 row-start-1 grid min-h-[5.5rem] justify-items-center wide:col-start-2 wide:row-span-1">
            {index < items.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-8 bottom-[-1.25rem] w-px border-l border-dashed border-line"
              />
            )}
            <span className="relative z-[1] grid size-7 place-items-center rounded-full border border-line bg-panel">
              <span className="size-3.5 rounded-full bg-[color:var(--card-accent)]" />
            </span>
          </div>

          <div className="col-start-2 row-start-2 grid gap-1.5 wide:col-start-3 wide:row-start-1">
            <h3 className="text-[clamp(1.0625rem,2vw,1.25rem)] leading-snug tracking-[-0.03em]">{item.role}</h3>
            <p className="max-w-[74ch] text-sm leading-relaxed text-muted">{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
