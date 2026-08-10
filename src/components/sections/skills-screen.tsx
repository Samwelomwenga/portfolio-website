import { RollingText } from "@/components/motion/rolling-text"
import { Stagger } from "@/components/motion/stagger"
import { TiltCard } from "@/components/motion/tilt-card"
import { Screen, SectionHeading } from "@/components/screen-shell"
import { CertificationPill } from "@/components/skills/certification-pill"
import { SkillChip } from "@/components/skills/skill-chip"
import { NoteCard } from "@/components/terminal/note-card"
import { stagger } from "@/lib/motion"
import { certifications, skillGroups } from "@/portfolio-data"

export function SkillsScreen() {
  return (
    <Screen id="skills">
      <SectionHeading title="Skills" headingId="screen-skills-title">
        <RollingText text="The languages, frameworks, and tools I work with, grouped for a quick scan." split="words" />
      </SectionHeading>
      <Stagger each={stagger.cards} className="grid gap-3.5 sm:grid-cols-2 wide:grid-cols-3">
        {skillGroups.map(group => (
          <TiltCard key={group.title}>
            <NoteCard state={group.state} title={group.title}>
              <Stagger as="ul" each={stagger.tight} className="m-0 flex list-none flex-wrap gap-2 p-0">
                {group.tags.map(tag => (
                  <SkillChip key={tag} tag={tag} />
                ))}
              </Stagger>
            </NoteCard>
          </TiltCard>
        ))}
      </Stagger>
      <div className="grid gap-2">
        <span className="text-[0.6875rem] font-extrabold tracking-[0.12em] text-muted uppercase">certifications</span>
        <Stagger as="ul" each={stagger.tight} className="m-0 flex list-none flex-wrap gap-2 p-0">
          {certifications.map(certification => (
            <CertificationPill key={certification.name} certification={certification} />
          ))}
        </Stagger>
      </div>
    </Screen>
  )
}
