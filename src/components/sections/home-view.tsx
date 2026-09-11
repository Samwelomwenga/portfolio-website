"use client"

import { AboutScreen } from "@/components/sections/about-screen"
import { BlogsScreen } from "@/components/sections/blogs-screen"
import { ContactScreen } from "@/components/sections/contact-screen"
import { ExperienceScreen } from "@/components/sections/experience-screen"
import { HeroScreen } from "@/components/sections/hero-screen"
import { ProjectsScreen } from "@/components/sections/projects-screen"
import { SkillsScreen } from "@/components/sections/skills-screen"
import { useShellNav } from "@/components/terminal/terminal-shell"
import { isSectionReady } from "@/lib/sections"

export function HomeView() {
  const { navigate } = useShellNav()

  return (
    <>
      <HeroScreen onNavigate={navigate} />
      <AboutScreen />
      <SkillsScreen />
      <ExperienceScreen />
      <ProjectsScreen />
      {isSectionReady("blogs") && <BlogsScreen />}
      <ContactScreen />
    </>
  )
}
