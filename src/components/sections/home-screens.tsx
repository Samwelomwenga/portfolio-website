import type { ArchiveRoute } from "@/lib/routes"
import type { SectionId } from "@/portfolio-data"
import { AboutScreen } from "@/components/sections/about-screen"
import { BlogsScreen } from "@/components/sections/blogs-screen"
import { ContactScreen } from "@/components/sections/contact-screen"
import { ExperienceScreen } from "@/components/sections/experience-screen"
import { HeroScreen } from "@/components/sections/hero-screen"
import { ProjectsScreen } from "@/components/sections/projects-screen"
import { SkillsScreen } from "@/components/sections/skills-screen"
import { isSectionReady } from "@/lib/sections"

type HomeScreensProps = {
  onNavigate: (id: SectionId) => void
  onArchive: (route: ArchiveRoute) => void
}

export function HomeScreens({ onNavigate, onArchive }: HomeScreensProps) {
  return (
    <>
      <HeroScreen onNavigate={onNavigate} />
      <AboutScreen />
      <SkillsScreen />
      <ExperienceScreen onArchive={onArchive} />
      <ProjectsScreen onArchive={onArchive} />
      {isSectionReady("blogs") && <BlogsScreen onArchive={onArchive} />}
      <ContactScreen />
    </>
  )
}
