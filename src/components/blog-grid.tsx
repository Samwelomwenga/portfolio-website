import type { BlogItem } from "@/portfolio-data"
import { RollingText } from "@/components/motion/rolling-text"
import { Stagger } from "@/components/motion/stagger"
import { TiltCard } from "@/components/motion/tilt-card"
import { NoteCard } from "@/components/terminal/note-card"
import { stagger } from "@/lib/motion"

type BlogGridProps = {
  items: readonly BlogItem[]
}

export function BlogGrid({ items }: BlogGridProps) {
  return (
    <Stagger each={stagger.cards} className="grid gap-3.5 sm:grid-cols-2 wide:grid-cols-3">
      {items.map(blog => (
        <TiltCard key={blog.title} className="h-full">
          <NoteCard state={blog.state} kicker="draft" className="h-full">
            <div className="grid gap-1.5">
              <span className="text-xs text-muted">{blog.meta}</span>
              <h3 className="text-lg leading-snug">{blog.title}</h3>
              <p className="text-sm text-muted">
                <RollingText text={blog.blurb} split="words" />
              </p>
            </div>
          </NoteCard>
        </TiltCard>
      ))}
    </Stagger>
  )
}
