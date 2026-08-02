import type { MotionValue } from "motion/react"
import type { ExperienceItem } from "@/portfolio-data"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react"

import { useRef } from "react"
import { Reveal } from "@/components/motion/reveal"
import { RollingText } from "@/components/motion/rolling-text"
import { cn, stateAccentClass } from "@/lib/utils"

type ExperienceTimelineProps = {
  items: readonly ExperienceItem[]
}

/** Smoothing for the scroll-linked spine so the fill trails the scroll gently. */
const spineSpring = { stiffness: 120, damping: 30, mass: 0.6 }

/**
 * Company · marker · role timeline, stacked on mobile and three-column wide.
 * Each entry reveals as it scrolls in (timeline archetype, ticket 06) and a
 * transform-only progress spine fills down the rail as you read past the rows.
 */
export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Progress 0→1 as the timeline travels through the reading area (top entering
  // low in the viewport → bottom leaving above the middle). Springed so the
  // spine fill eases behind the scroll rather than tracking it 1:1.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.5"],
  })
  const progress = useSpring(scrollYProgress, spineSpring)

  return (
    <div ref={containerRef} className="grid gap-5">
      {items.map((item, index) => (
        <TimelineEntry
          key={`${item.company}-${item.role}`}
          item={item}
          index={index}
          total={items.length}
          progress={progress}
        />
      ))}
    </div>
  )
}

type TimelineEntryProps = {
  item: ExperienceItem
  index: number
  total: number
  /** Shared 0→1 scroll progress for the whole timeline. */
  progress: MotionValue<number>
}

/**
 * A single timeline row. Reveals via the shared <Reveal> primitive (reduced
 * motion keeps the fade, drops the rise via the root <MotionConfig>). The
 * connector to the next row carries a scroll-linked `scaleY` fill mapped to
 * this segment's slice of the timeline's progress — dropped entirely under
 * reduced motion (guardrail 02-A/B).
 */
function TimelineEntry({ item, index, total, progress }: TimelineEntryProps) {
  const prefersReducedMotion = useReducedMotion()
  const hasConnector = index < total - 1
  // This segment fills as progress crosses its slice of the rail. With `total`
  // rows there are `total - 1` segments, so segment `index` spans
  // [index / segments, (index + 1) / segments].
  const segments = Math.max(total - 1, 1)
  const fillScale = useTransform(progress, [index / segments, (index + 1) / segments], [0, 1], {
    clamp: true,
  })

  return (
    <Reveal
      as="article"
      y={32}
      duration={0.8}
      className={cn(
        stateAccentClass(item.state),
        "grid min-h-[5.5rem] items-start gap-x-3 gap-y-1.5 [grid-template-columns:1.75rem_minmax(0,1fr)] wide:gap-[clamp(1rem,2.5vw,1.75rem)] wide:[grid-template-columns:minmax(9.5rem,0.4fr)_2.75rem_minmax(0,1fr)]",
      )}
    >
      <div className="col-start-2 row-start-1 grid gap-1 wide:col-start-1">
        <strong className="text-base leading-tight">{item.company}</strong>
        <time className="text-[0.6875rem] tracking-[0.01em] text-muted">{item.period}</time>
      </div>

      <div className="relative col-start-1 row-span-2 row-start-1 grid min-h-[5.5rem] justify-items-center wide:col-start-2 wide:row-span-1">
        {hasConnector && (
          <>
            <span
              aria-hidden="true"
              className="absolute top-8 bottom-[-1.25rem] w-px border-l border-dashed border-line"
            />
            {!prefersReducedMotion && (
              <motion.span
                aria-hidden="true"
                style={{ scaleY: fillScale }}
                className="absolute top-8 bottom-[-1.25rem] w-px origin-top bg-[color:var(--card-accent)]"
              />
            )}
          </>
        )}
        <span className="relative z-[1] grid size-7 place-items-center rounded-full border border-line bg-panel">
          <span className="size-3.5 rounded-full bg-[color:var(--card-accent)]" />
        </span>
      </div>

      <div className="col-start-2 row-start-2 grid gap-1.5 wide:col-start-3 wide:row-start-1">
        <h3 className="text-[clamp(1.0625rem,2vw,1.25rem)] leading-snug">{item.role}</h3>
        <p className="max-w-[74ch] text-sm leading-relaxed text-muted">
          <RollingText text={item.description} split="words" />
        </p>
        {item.points && item.points.length > 0 && (
          <ul className="mt-1 grid max-w-[74ch] list-none gap-1.5 p-0 text-sm leading-relaxed text-muted">
            {item.points.map(point => (
              <li key={point} className="grid grid-cols-[0.75rem_minmax(0,1fr)] items-start gap-2">
                <span aria-hidden="true" className="mt-[0.4em] size-1.5 rounded-full bg-[color:var(--card-accent)]" />
                <RollingText text={point} split="words" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
  )
}
