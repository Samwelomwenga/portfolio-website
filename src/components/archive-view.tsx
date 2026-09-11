"use client"

import type { ArchiveRoute } from "@/lib/routes"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { BlogGrid } from "@/components/blog-grid"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { ProjectGrid } from "@/components/project-grid"
import { SectionHeading } from "@/components/screen-shell"
import { linkMicroInteraction } from "@/lib/motion"
import { blogs, experience, projects } from "@/portfolio-data"

type ArchiveViewProps = {
  type: ArchiveRoute
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

const BackLink = motion.create(Link)

export function ArchiveView({ type }: ArchiveViewProps) {
  const meta = archiveMeta[type]

  return (
    <section
      id={`screen-${type}`}
      data-section={type}
      aria-labelledby={`screen-${type}-title`}
      className="relative grid content-start gap-5 p-[clamp(1.25rem,4vw,2.75rem)]"
    >
      <BackLink href="/" className="inline-flex w-max items-center gap-1 text-[0.8125rem] font-extrabold text-state-orange" {...linkMicroInteraction}>
        <ArrowUpRight className="size-3.5 rotate-180" aria-hidden="true" />
        Back to terminal
      </BackLink>
      <SectionHeading title={meta.title} headingId={`screen-${type}-title`}>{meta.blurb}</SectionHeading>

      {type === "experience" && <ExperienceTimeline items={experience} />}
      {type === "projects" && <ProjectGrid items={projects} />}
      {type === "blogs" && <BlogGrid items={blogs} />}
    </section>
  )
}
