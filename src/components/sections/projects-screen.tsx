import { ArchiveLink } from "@/components/archive-link"
import { RollingText } from "@/components/motion/rolling-text"
import { ProjectGrid } from "@/components/project-grid"
import { Screen, SectionHeading } from "@/components/screen-shell"
import { ARCHIVE_THRESHOLD } from "@/lib/archive"
import { projects } from "@/portfolio-data"

const featuredProjects = projects.filter(project => project.featured)

export function ProjectsScreen() {
  return (
    <Screen id="projects">
      <div className="flex flex-col items-start justify-between gap-4 wide:flex-row wide:items-end">
        <SectionHeading title="Projects" headingId="screen-projects-title">
          <RollingText text="A selection of the web apps and backend systems I've shipped." split="words" />
        </SectionHeading>
        {projects.length > ARCHIVE_THRESHOLD && <ArchiveLink href="/projects">More projects</ArchiveLink>}
      </div>
      <ProjectGrid items={featuredProjects} />
    </Screen>
  )
}
