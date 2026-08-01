import type { ReactNode } from "react"
import type { BlogItem, ProjectItem, SectionId } from "@/portfolio-data"
import {
  SiCss,
  SiDotnet,
  SiExpo,
  SiFigma,
  SiFirebase,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "@icons-pack/react-simple-icons"
import { ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { useEffect, useRef, useState } from "react"
import { AssistantConsole } from "@/components/assistant-console"
import { ContactForm } from "@/components/contact-form"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { RollingText } from "@/components/motion/rolling-text"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import { TerminalText } from "@/components/motion/terminal-text"
import { TiltCard } from "@/components/motion/tilt-card"
import { ProjectCard } from "@/components/project-card"
import { NoteCard } from "@/components/terminal/note-card"
import { PromptLine } from "@/components/terminal/prompt-line"
import { StatusPill } from "@/components/terminal/status-pill"
import { TerminalFrame } from "@/components/terminal/terminal-frame"
import { useActiveSection } from "@/hooks/use-active-section"
import { useTerminalTheme } from "@/hooks/use-terminal-theme"
import { cardReveal, consoleReveal, maskLine, spring, stagger, staggerItem } from "@/lib/motion"
import { cn } from "@/lib/utils"
import {
  aboutParagraphs,
  blogs,
  certifications,
  contactCommands,
  experience,
  hero,
  navItems,
  profile,
  projects,
  skillGroups,
} from "@/portfolio-data"

const archiveRoutes = ["experience", "projects", "blogs"] as const
type ArchiveRoute = (typeof archiveRoutes)[number]
type Route = "home" | ArchiveRoute

const sectionIds = navItems.map(item => item.id)
const isSectionId = (value: string): value is SectionId => (sectionIds as readonly string[]).includes(value)
const commandFor = (id: SectionId) => navItems.find(item => item.id === id)?.command ?? "$"
const featuredExperience = experience.filter(item => item.featured)
const featuredProjects = projects.filter(project => project.featured)
const featuredBlogs = blogs.filter(blog => blog.featured)

// Only surface an archive link once a section has more entries than fit comfortably on the home screen.
const ARCHIVE_THRESHOLD = 6

type SkillIconEntry = {
  Icon: typeof SiReact
  iconClass: string
}

const skillIcons: Record<string, SkillIconEntry> = {
  "HTML5": { Icon: SiHtml5, iconClass: "text-[#E34F26]" },
  "CSS3": { Icon: SiCss, iconClass: "text-[#1572B6]" },
  "JavaScript": { Icon: SiJavascript, iconClass: "text-[#F7DF1E]" },
  "TypeScript": { Icon: SiTypescript, iconClass: "text-[#3178C6]" },
  "C#": { Icon: SiDotnet, iconClass: "text-[#512BD4]" },
  "Postgres": { Icon: SiPostgresql, iconClass: "text-[#4169E1]" },
  "React": { Icon: SiReact, iconClass: "text-[#61DAFB]" },
  "Next.js": { Icon: SiNextdotjs, iconClass: "text-[#000000]" },
  "React Native": { Icon: SiReact, iconClass: "text-[#61DAFB]" },
  "Expo Router": { Icon: SiExpo, iconClass: "text-[#000020]" },
  "Tailwind CSS": { Icon: SiTailwindcss, iconClass: "text-[#06B6D4]" },
  ".NET Core": { Icon: SiDotnet, iconClass: "text-[#512BD4]" },
  "EF Core": { Icon: SiDotnet, iconClass: "text-[#512BD4]" },
  "Git": { Icon: SiGit, iconClass: "text-[#F05032]" },
  "Postman": { Icon: SiPostman, iconClass: "text-[#FF6C37]" },
  "Figma": { Icon: SiFigma, iconClass: "text-[#F24E1E]" },
  "Supabase": { Icon: SiSupabase, iconClass: "text-[#3FCF8E]" },
  "Firebase": { Icon: SiFirebase, iconClass: "text-[#DD2C00]" },
} satisfies Record<string, SkillIconEntry>

function getRouteFromHash(): Route {
  const hash = window.location.hash.slice(1)
  if (hash.startsWith("/")) {
    const candidate = hash.slice(1)
    return archiveRoutes.includes(candidate as ArchiveRoute) ? candidate as ArchiveRoute : "home"
  }
  return "home"
}

function App() {
  const { theme, mode, effectiveMode, setTheme, setMode } = useTerminalTheme()
  const prefersReducedMotion = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [route, setRoute] = useState<Route>(() => getRouteFromHash())

  const { activeId, jumpTo } = useActiveSection(scrollRef, sectionIds, route === "home")
  const displayedActive = route === "home" ? activeId : route

  useEffect(() => {
    function scrollToHashSection() {
      const hash = window.location.hash.slice(1)
      if (!isSectionId(hash)) {
        return
      }

      const host = scrollRef.current
      const target = host?.querySelector<HTMLElement>(`[data-section="${hash}"]`)
      if (!host || !target) {
        return
      }

      const top = host.scrollTop + target.getBoundingClientRect().top - host.getBoundingClientRect().top
      host.scrollTo({ top: Math.max(0, top), behavior: "smooth" })
    }

    function syncRouteFromHash() {
      const nextRoute = getRouteFromHash()
      setRoute(nextRoute)

      if (nextRoute !== "home") {
        scrollRef.current?.scrollTo({ top: 0, behavior: "auto" })
        return
      }

      window.requestAnimationFrame(scrollToHashSection)
    }

    window.addEventListener("hashchange", syncRouteFromHash)
    const frame = window.requestAnimationFrame(syncRouteFromHash)

    return () => {
      window.removeEventListener("hashchange", syncRouteFromHash)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  function handleNavigate(id: SectionId) {
    // From an archive, switch the hash to the section; the hash sync returns
    // home and scrolls to it. On home, jump straight away.
    if (getRouteFromHash() !== "home") {
      window.location.hash = `#${id}`
      return
    }
    window.history.replaceState(null, "", `#${id}`)
    jumpTo(id)
  }

  function goToArchive(target: ArchiveRoute) {
    window.location.hash = `#/${target}`
  }

  return (
    <TerminalFrame
      theme={theme}
      mode={mode}
      effectiveMode={effectiveMode}
      activeId={displayedActive}
      onNavigate={handleNavigate}
      onThemeChange={setTheme}
      onModeChange={setMode}
      scrollRef={scrollRef}
    >
      <motion.div
        key={route}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {route === "home"
          ? <HomeScreens onNavigate={handleNavigate} onArchive={goToArchive} />
          : <ArchiveScreen route={route} onNavigate={handleNavigate} />}
      </motion.div>
    </TerminalFrame>
  )
}

type ScreenProps = {
  id: SectionId
  children: ReactNode
}

function Screen({ id, children }: ScreenProps) {
  return (
    <section
      id={`screen-${id}`}
      data-section={id}
      aria-labelledby={`screen-${id}-title`}
      className="relative grid content-start gap-5 border-b border-border p-[clamp(1.25rem,4vw,2.75rem)] scroll-mt-5 last:border-b-0 wide:min-h-[calc(100svh-2.375rem)]"
    >
      <PromptLine section={id} command={commandFor(id)} />
      {children}
    </section>
  )
}

type SectionHeadingProps = {
  title: string
  headingId?: string
  children?: ReactNode
}

function SectionHeading({ title, headingId, children }: SectionHeadingProps) {
  return (
    <div className="grid max-w-[48.75rem] gap-2">
      <h2 id={headingId} className="text-[clamp(1.75rem,5vw,2.875rem)] leading-tight text-balance">{title}</h2>
      {children && <p className="max-w-[65ch] text-base text-muted">{children}</p>}
    </div>
  )
}

type ArchiveLinkProps = {
  children: ReactNode
  onClick: () => void
}

function ArchiveLink({ children, onClick }: ArchiveLinkProps) {
  return (
    <button type="button" onClick={onClick} className="inline-flex w-max items-center gap-1 text-[0.8125rem] font-extrabold whitespace-nowrap text-state-orange">
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </button>
  )
}

type HomeScreensProps = {
  onNavigate: (id: SectionId) => void
  onArchive: (route: ArchiveRoute) => void
}

function HomeScreens({ onNavigate, onArchive }: HomeScreensProps) {
  return (
    <>
      <Screen id="home">
        <div className="grid gap-3.5 wide:grid-cols-[minmax(0,1fr)_minmax(21.25rem,0.92fr)] wide:items-center wide:gap-x-[clamp(1.125rem,3vw,2.125rem)]">
          {/* Above the fold: entrance plays on load, not on scroll. The heading
              rises line by line from behind a mask, the role line types in, and
              the blurb follows. Reduced motion drops the movement (root
              <MotionConfig>) so each line simply fades to its final state. */}
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
            {/* Staggered rolling-text reveal (per word, for readable wrapping);
                re-rolls on hover. Falls back to plain text under reduced motion. */}
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

          {/* Small stagger tail after the text: buttons enter last, on load. */}
          <Stagger trigger="load" delay={0.6} className="flex flex-wrap items-center gap-2.5 wide:col-start-1 wide:row-start-2">
            <StaggerItem as="span" className="inline-flex"><ActionButton primary onClick={() => onNavigate("projects")}><RollingText text="view projects" driven /></ActionButton></StaggerItem>
            <StaggerItem as="span" className="inline-flex"><ActionButton onClick={() => onNavigate("contact")}><RollingText text="contact" driven /></ActionButton></StaggerItem>
          </Stagger>
        </div>
      </Screen>

      <Screen id="about">
        <SectionHeading title="About" headingId="screen-about-title" />
        {/* Paragraphs stagger in on scroll with the more pronounced cardReveal
            (larger rise + scale), one clearly at a time; each rolls word-by-word
            on hover only. */}
        <Stagger each={stagger.cards} className="grid max-w-[72ch] gap-4">
          {aboutParagraphs.map(paragraph => (
            <StaggerItem as="p" variants={cardReveal} key={paragraph.slice(0, 24)} className="text-[0.9375rem] leading-relaxed text-muted">
              <RollingText text={paragraph} split="words" />
            </StaggerItem>
          ))}
        </Stagger>
      </Screen>

      <Screen id="skills">
        <SectionHeading title="Skills" headingId="screen-skills-title">
          <RollingText text="The languages, frameworks, and tools I work with, grouped for a quick scan." split="words" />
        </SectionHeading>
        {/* Chip/card grid archetype (ticket 05): the three groups lift in one at
            a time on scroll (cardReveal + relaxed gap so the entrance reads),
            each card's chips cascade behind it with a tight gap, and each card
            leans toward the pointer on hover. */}
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
              <StaggerItem
                as="li"
                key={certification}
                whileHover={{ y: -3, scale: 1.04 }}
                transition={spring.snappy}
                className="inline-flex min-h-7 items-center rounded-sm border border-border bg-surface px-2.5 text-xs font-bold text-fg"
              >
                {certification}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Screen>

      <Screen id="experience">
        <div className="flex flex-col items-start justify-between gap-4 wide:flex-row wide:items-end">
          <div className="grid gap-2">
            <h2 id="screen-experience-title" className="max-w-[38.75rem] text-[clamp(1.5rem,4vw,2.375rem)] leading-tight text-balance">Featured Experience</h2>
          </div>
          {experience.length > ARCHIVE_THRESHOLD && <ArchiveLink onClick={() => onArchive("experience")}>More experience</ArchiveLink>}
        </div>
        <ExperienceTimeline items={featuredExperience} />
      </Screen>

      <Screen id="projects">
        <div className="flex flex-col items-start justify-between gap-4 wide:flex-row wide:items-end">
          <SectionHeading title="Projects" headingId="screen-projects-title">
            <RollingText text="A selection of the web apps and backend systems I've shipped." split="words" />
          </SectionHeading>
          {projects.length > ARCHIVE_THRESHOLD && <ArchiveLink onClick={() => onArchive("projects")}>More projects</ArchiveLink>}
        </div>
        <ProjectGrid items={featuredProjects} />
      </Screen>

      <Screen id="blogs">
        <div className="flex flex-col items-start justify-between gap-4 wide:flex-row wide:items-end">
          <SectionHeading title="Blogs" headingId="screen-blogs-title">
            <RollingText text="A lean index of writing on process, interface craft, and implementation." split="words" />
          </SectionHeading>
          {blogs.length > ARCHIVE_THRESHOLD && <ArchiveLink onClick={() => onArchive("blogs")}>More blogs</ArchiveLink>}
        </div>
        <BlogGrid items={featuredBlogs} />
      </Screen>

      <Screen id="contact">
        {/* Contact reveals like the Projects grid (ticket 09 revisited): the
            command card and the form lift in with `cardReveal`, the card leans
            toward the pointer on hover via <TiltCard>, and the blurb rolls
            word-by-word on hover like the project blurbs. */}
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
    </>
  )
}

function SkillChip({ tag }: { tag: string }) {
  const icon = skillIcons[tag]

  return (
    <motion.li variants={staggerItem} data-skill={tag} className="inline-flex min-h-8 items-center gap-1.5 rounded-sm border border-border bg-surface py-1 pr-2.5 pl-1 text-xs font-bold text-fg">
      {icon && (
        <span className="grid size-5 shrink-0 place-items-center rounded-sm bg-white/95">
          <icon.Icon aria-hidden="true" className={cn("size-3.5", icon.iconClass)} focusable="false" title="" />
        </span>
      )}
      <span>{tag}</span>
    </motion.li>
  )
}

type ArchiveScreenProps = {
  route: ArchiveRoute
  onNavigate: (id: SectionId) => void
}

type ArchiveMeta = {
  title: string
  blurb: string
}

function ArchiveScreen({ route, onNavigate }: ArchiveScreenProps) {
  const titles: Record<ArchiveRoute, ArchiveMeta> = {
    experience: { title: "All Experience", blurb: "The fuller path behind the featured roles on the home page." },
    projects: { title: "Project Library", blurb: "A broader view of selected interface, web, and system work." },
    blogs: { title: "Blog Library", blurb: "Notes on process, interface decisions, and front-end implementation." },
  }

  return (
    <section
      id={`screen-${route}`}
      data-section={route}
      aria-labelledby={`screen-${route}-title`}
      className="relative grid content-start gap-5 p-[clamp(1.25rem,4vw,2.75rem)]"
    >
      <button type="button" onClick={() => onNavigate("home")} className="inline-flex w-max items-center gap-1 text-[0.8125rem] font-extrabold text-state-orange">
        <ArrowUpRight className="size-3.5 rotate-180" aria-hidden="true" />
        Back to terminal
      </button>
      <SectionHeading title={titles[route].title} headingId={`screen-${route}-title`}>{titles[route].blurb}</SectionHeading>

      {route === "experience" && <ExperienceTimeline items={experience} />}

      {route === "projects" && <ProjectGrid items={projects} />}

      {route === "blogs" && <BlogGrid items={blogs} />}
    </section>
  )
}

type ProjectGridProps = {
  items: readonly ProjectItem[]
}

function ProjectGrid({ items }: ProjectGridProps) {
  // Chip/card grid archetype (ticket 07), mirroring Skills: the cards lift in
  // one at a time on scroll (cardReveal + relaxed gap) and each leans toward the
  // pointer on hover via <TiltCard>. A filter change swaps the mounted cards, so
  // the survivors re-reveal through the same stagger.
  return (
    <Stagger each={stagger.cards} className="grid gap-3.5 sm:grid-cols-2 wide:grid-cols-3">
      {items.map(project => (
        <TiltCard key={project.title} className="h-full">
          <ProjectCard project={project} />
        </TiltCard>
      ))}
    </Stagger>
  )
}

type BlogGridProps = {
  items: readonly BlogItem[]
}

function BlogGrid({ items }: BlogGridProps) {
  // Chip/card grid archetype (ticket 08), mirroring Projects/Skills: the cards
  // lift in one at a time on scroll (cardReveal + relaxed gap) and each leans
  // toward the pointer on hover via <TiltCard>. The blurb rolls in word by word.
  return (
    <Stagger each={stagger.cards} className="grid gap-3.5 sm:grid-cols-2 wide:grid-cols-3">
      {items.map(blog => (
        <TiltCard key={blog.title} className="h-full">
          <NoteCard state={blog.state} kicker="draft" className="h-full">
            <div className="grid gap-1.5">
              <span className="text-xs text-muted">{blog.meta}</span>
              <h3 className="text-lg leading-snug">{blog.title}</h3>
              <p className="text-sm text-muted">
                <RollingText text={blog.blurb} split="words" />
              </p>
            </div>
          </NoteCard>
        </TiltCard>
      ))}
    </Stagger>
  )
}

type ActionButtonProps = {
  children: ReactNode
  primary?: boolean
  onClick: () => void
}

function ActionButton({ children, primary, onClick }: ActionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial="rest"
      whileHover="rolled"
      whileTap={{ scale: 0.96 }}
      transition={spring.snappy}
      variants={{ rest: { y: 0 }, rolled: { y: -2 } }}
      className={primary
        ? "inline-flex min-h-[2.375rem] items-center justify-center gap-2 rounded-sm border border-accent bg-accent px-3 text-xs font-extrabold tracking-[0.02em] text-[color:var(--bg)]"
        : "inline-flex min-h-[2.375rem] items-center justify-center gap-2 rounded-sm border border-border bg-surface px-3 text-xs font-extrabold tracking-[0.02em] text-fg hover:border-line"}
    >
      {children}
    </motion.button>
  )
}

export default App
