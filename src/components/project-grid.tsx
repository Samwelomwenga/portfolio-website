import type { ProjectItem } from "@/portfolio-data"
import { Stagger } from "@/components/motion/stagger"
import { TiltCard } from "@/components/motion/tilt-card"
import { ProjectCard } from "@/components/project-card"
import { stagger } from "@/lib/motion"

type ProjectGridProps = {
  items: readonly ProjectItem[]
}

export function ProjectGrid({ items }: ProjectGridProps) {
  return (
    <Stagger each={stagger.cards} className="grid gap-3.5 sm:grid-cols-2 wide:grid-cols-3">
      {items.map(project => (
        <TiltCard key={project.title} className="h-full">
          <ProjectCard project={project} />
        </TiltCard>
      ))}
    </Stagger>
  )
}
