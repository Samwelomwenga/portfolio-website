import { RollingText } from "@/components/motion/rolling-text"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import { Screen, SectionHeading } from "@/components/screen-shell"
import { cardReveal, stagger } from "@/lib/motion"
import { aboutParagraphs } from "@/portfolio-data"

export function AboutScreen() {
  return (
    <Screen id="about">
      <SectionHeading title="About" headingId="screen-about-title" />
      <Stagger each={stagger.cards} className="grid max-w-[72ch] gap-4">
        {aboutParagraphs.map(paragraph => (
          <StaggerItem as="p" variants={cardReveal} key={paragraph.slice(0, 24)} className="text-[0.9375rem] leading-relaxed text-muted">
            <RollingText text={paragraph} split="words" />
          </StaggerItem>
        ))}
      </Stagger>
    </Screen>
  )
}
