import type { SectionId } from "@/portfolio-data"
import { motion } from "motion/react"
import { ActionButton } from "@/components/action-button"
import { AssistantConsole } from "@/components/assistant-console"
import { RollingText } from "@/components/motion/rolling-text"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import { TerminalText } from "@/components/motion/terminal-text"
import { Screen } from "@/components/screen-shell"
import { consoleReveal, maskLine, spring } from "@/lib/motion"
import { hero } from "@/portfolio-data"

type HeroScreenProps = {
  onNavigate: (id: SectionId) => void
}

export function HeroScreen({ onNavigate }: HeroScreenProps) {
  return (
    <Screen id="home">
      <div className="grid gap-3.5 wide:grid-cols-[minmax(0,1fr)_minmax(21.25rem,0.92fr)] wide:items-center wide:gap-x-[clamp(1.125rem,3vw,2.125rem)]">
        <Stagger trigger="load" className="grid content-start gap-4 wide:col-start-1 wide:row-start-1">
          <h1 id="screen-home-title" className="grid gap-1 text-[clamp(2.875rem,7vw,5.75rem)] leading-[0.94] text-balance">
            <span className="overflow-hidden pb-[0.08em]">
              <StaggerItem as="span" variants={maskLine} whileHover={{ scale: 1.03 }} transition={spring.snappy} style={{ transformOrigin: "left" }} className="block w-max font-extrabold text-term-green">{hero.firstName}</StaggerItem>
            </span>
            <span className="overflow-hidden pb-[0.08em]">
              <StaggerItem as="span" variants={maskLine} whileHover={{ scale: 1.03 }} transition={spring.snappy} style={{ transformOrigin: "left" }} className="block w-max font-extrabold text-term-yellow">{hero.lastName}</StaggerItem>
            </span>
          </h1>
          <StaggerItem as="p" whileHover={{ scale: 1.03 }} transition={spring.snappy} style={{ transformOrigin: "left" }} className="flex w-max flex-wrap items-center gap-1.5 text-[clamp(1.125rem,2vw,1.75rem)] leading-snug tracking-[0.02em]">
            <span className="font-extrabold text-term-green">&lt;</span>
            <TerminalText text="Software" caret={false} startDelay={720} className="font-extrabold text-term-yellow" />
            <TerminalText text="Engineer" startDelay={950} className="font-extrabold text-term-red" />
            <span className="font-extrabold text-term-yellow">/&gt;</span>
          </StaggerItem>
          <p className="max-w-[62ch] text-[clamp(0.875rem,1.25vw,1rem)] leading-relaxed text-muted text-pretty">
            <RollingText text={hero.about} split="words" revealOnView />
          </p>
        </Stagger>

        <motion.div
          className="wide:col-start-2 wide:row-span-2 wide:row-start-1"
          initial="hidden"
          animate="visible"
          variants={consoleReveal}
        >
          <AssistantConsole />
        </motion.div>

        <Stagger trigger="load" delay={0.6} className="flex flex-wrap items-center gap-2.5 wide:col-start-1 wide:row-start-2">
          <StaggerItem as="span" className="inline-flex">
            <ActionButton primary onClick={() => onNavigate("projects")}><RollingText text="view projects" driven /></ActionButton>
          </StaggerItem>
          <StaggerItem as="span" className="inline-flex">
            <ActionButton onClick={() => onNavigate("contact")}><RollingText text="contact" driven /></ActionButton>
          </StaggerItem>
        </Stagger>
      </div>
    </Screen>
  )
}
