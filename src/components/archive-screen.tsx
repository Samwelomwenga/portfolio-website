import type { ArchiveRoute } from "@/lib/routes"
import type { SectionId } from "@/portfolio-data"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import { BlogGrid } from "@/components/blog-grid"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { ProjectGrid } from "@/components/project-grid"
import { SectionHeading } from "@/components/screen-shell"
import { linkMicroInteraction } from "@/lib/motion"
import { blogs, experience, projects } from "@/portfolio-data"

type ArchiveScreenProps = {
  route: ArchiveRoute
  onNavigate: (id: SectionId) => void
}

type ArchiveMeta = {
  title: string
  blurb: string
}

const archiveMeta = {
  experience: { title: "All Experience", blurb: "The fuller path behind the featured roles on the home page." },
  projects: { title: "Project Library", blurb: "A broader view of selected interface, web, and system work." },
  blogs: { title: "Blog Library", blurb: "Notes on process, interface decisions, and front-end implementation." },
} satisfies Record<ArchiveRoute, ArchiveMeta>

export function ArchiveScreen({ route, onNavigate }: ArchiveScreenProps) {
  const meta = archiveMeta[route]

  return (
    <section
      id={`screen-${route}`}
      data-section={route}
      aria-labelledby={`screen-${route}-title`}
      className="relative grid content-start gap-5 p-[clamp(1.25rem,4vw,2.75rem)]"
    >
      <motion.button type="button" onClick={() => onNavigate("home")} className="inline-flex w-max items-center gap-1 text-[0.8125rem] font-extrabold text-state-orange" {...linkMicroInteraction}>
        <ArrowUpRight className="size-3.5 rotate-180" aria-hidden="true" />
        Back to terminal
      </motion.button>
      <SectionHeading title={meta.title} headingId={`screen-${route}-title`}>{meta.blurb}</SectionHeading>

      {route === "experience" && <ExperienceTimeline items={experience} />}
      {route === "projects" && <ProjectGrid items={projects} />}
      {route === "blogs" && <BlogGrid items={blogs} />}
    </section>
  )
}
