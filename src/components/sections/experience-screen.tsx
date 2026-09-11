import { ArchiveLink } from "@/components/archive-link"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { Screen } from "@/components/screen-shell"
import { ARCHIVE_THRESHOLD } from "@/lib/archive"
import { experience } from "@/portfolio-data"

const featuredExperience = experience.filter(item => item.featured)

export function ExperienceScreen() {
  return (
    <Screen id="experience">
      <div className="flex flex-col items-start justify-between gap-4 wide:flex-row wide:items-end">
        <div className="grid gap-2">
          <h2 id="screen-experience-title" className="max-w-[38.75rem] text-[clamp(1.5rem,4vw,2.375rem)] leading-tight text-balance">Featured Experience</h2>
        </div>
        {experience.length > ARCHIVE_THRESHOLD && <ArchiveLink href="/experience">More experience</ArchiveLink>}
      </div>
      <ExperienceTimeline items={featuredExperience} />
    </Screen>
  )
}
