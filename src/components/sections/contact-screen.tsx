import { ContactForm } from "@/components/contact-form"
import { RollingText } from "@/components/motion/rolling-text"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import { TiltCard } from "@/components/motion/tilt-card"
import { Screen } from "@/components/screen-shell"
import { StatusPill } from "@/components/terminal/status-pill"
import { cardReveal, stagger } from "@/lib/motion"
import { contactCommands, profile } from "@/portfolio-data"

export function ContactScreen() {
  return (
    <Screen id="contact">
      <Stagger as="div" each={stagger.cards} className="grid gap-4.5 wide:grid-cols-[minmax(13.75rem,0.58fr)_minmax(22.5rem,1.42fr)] wide:items-start">
        <Stagger as="div" each={stagger.cards} className="grid max-w-[22.5rem] content-start gap-3">
          <StaggerItem as="h2" id="screen-contact-title" className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">Contact</StaggerItem>
          <StaggerItem as="p" className="text-sm text-muted">
            <RollingText text={`Based in ${profile.location} — reach me on GitHub, LinkedIn, or X.`} split="words" />
          </StaggerItem>
          <TiltCard className="rounded-md border border-border bg-surface p-3">
            {contactCommands.map(row => (
              <div key={row.command} className="grid min-h-[2.125rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 text-[0.8125rem]">
                <span className="font-extrabold text-success">$</span>
                <code className="min-w-0 truncate text-fg">{row.command}</code>
                <a href={row.href} target="_blank" rel="noreferrer"><StatusPill>{row.action}</StatusPill></a>
              </div>
            ))}
          </TiltCard>
        </Stagger>
        <StaggerItem as="div" variants={cardReveal}>
          <ContactForm />
        </StaggerItem>
      </Stagger>
    </Screen>
  )
}
