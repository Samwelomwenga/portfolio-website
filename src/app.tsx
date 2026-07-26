import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Code2,
  Github,
  Layers,
  LayoutGrid,
  Linkedin,
  Mail,
  Menu,
  Monitor,
  Newspaper,
  PenTool,
  Smartphone,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

import { ContactForm } from "@/components/contact-form"
import { SectionReveal } from "@/components/section-reveal"
import { aboutHighlights, assets, blogs, experience, navItems, profile, projects, skills, socialLinks } from "@/portfolio-data"

const iconMap = {
  monitor: Monitor,
  smartphone: Smartphone,
  badge: BadgeCheck,
} as const

const socialIconMap = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
} as const

const filterIconMap = {
  all: LayoutGrid,
  interface: Smartphone,
  web: Monitor,
  system: Layers,
  process: CalendarDays,
  build: Code2,
} as const

const archiveRoutes = ["experience", "projects", "blogs"] as const

type ArchiveRoute = (typeof archiveRoutes)[number]
type PageRoute = "home" | ArchiveRoute
type ProjectLens = "all" | (typeof projects)[number]["lens"]
type BlogLens = "all" | (typeof blogs)[number]["lens"]
type ExperienceItem = (typeof experience)[number]
type BlogItem = (typeof blogs)[number]

interface LensOption {
  detail: string
  icon: keyof typeof filterIconMap
  id: string
  label: string
}

const featuredExperience = experience.filter(item => item.featured)
const featuredProjects = projects.filter(project => project.featured)
const featuredBlogs = blogs.filter(blog => blog.featured)

const projectLenses = [
  { id: "all", label: "Whole Board", detail: "Every project", icon: "all" },
  { id: "interface", label: "App Flows", detail: "Screens and journeys", icon: "interface" },
  { id: "web", label: "Web Builds", detail: "Sites and dashboards", icon: "web" },
  { id: "system", label: "Systems", detail: "Kits and identity", icon: "system" },
] as const satisfies readonly LensOption[]

const blogLenses = [
  { id: "all", label: "Reading Desk", detail: "All posts", icon: "all" },
  { id: "process", label: "Process Notes", detail: "Workflow decisions", icon: "process" },
  { id: "interface", label: "Interface Ideas", detail: "UX and layout", icon: "interface" },
  { id: "build", label: "Build Logs", detail: "React and systems", icon: "build" },
] as const satisfies readonly LensOption[]

function getRouteFromHash(): PageRoute {
  const hash = window.location.hash.slice(1)
  const route = hash.startsWith("/") ? hash.slice(1) : ""

  return archiveRoutes.includes(route as ArchiveRoute) ? route as ArchiveRoute : "home"
}

function scrollToHash(hash: string) {
  if (!hash || hash.startsWith("#/")) {
    return
  }

  document.querySelector(hash)?.scrollIntoView({ block: "start" })
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [route, setRoute] = useState<PageRoute>(() => getRouteFromHash())
  const [activeHref, setActiveHref] = useState<string>(navItems[0]?.href ?? "#home")
  const prefersReducedMotion = useReducedMotion()
  const displayedActiveHref = route === "home" ? activeHref : `#${route}`

  useEffect(() => {
    function syncRoute() {
      setRoute(getRouteFromHash())
    }

    window.addEventListener("hashchange", syncRoute)

    return () => window.removeEventListener("hashchange", syncRoute)
  }, [])

  useEffect(() => {
    if (route !== "home") {
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }))
      return
    }

    window.requestAnimationFrame(() => scrollToHash(window.location.hash))
  }, [route])

  useEffect(() => {
    if (route !== "home") {
      return
    }

    const sections = navItems
      .map(item => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => section !== null)

    if (sections.length === 0) {
      return
    }

    function updateActiveSection() {
      const headerOffset = 110
      const activeSection = sections.reduce((current, section) => {
        const isAboveHeader = section.getBoundingClientRect().top <= headerOffset
        return isAboveHeader ? section : current
      }, sections[0])

      setActiveHref(`#${activeSection.id}`)
    }

    const observer = new IntersectionObserver(updateActiveSection, {
      rootMargin: "-28% 0px -62% 0px",
      threshold: [0, 0.2, 0.6],
    })

    sections.forEach(section => observer.observe(section))
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.requestAnimationFrame(updateActiveSection)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", updateActiveSection)
    }
  }, [route])

  function handleNavClick(href: string) {
    setActiveHref(href)
    setIsMenuOpen(false)
  }

  return (
    <div className="page-frame">
      <div className="site-shell">
        <header className="site-header">
          <a className="brand" href="#home" aria-label={`${profile.name} home`} onClick={() => handleNavClick("#home")}>{profile.shortName}</a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map(item => (
              <a
                key={item.href}
                className={item.href === displayedActiveHref ? "active" : undefined}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-contact">
            {socialLinks.map((link) => {
              const Icon = socialIconMap[link.icon]

              return (
                <a className="icon-link" href={link.href} aria-label={link.label} key={link.label}>
                  <Icon aria-hidden="true" />
                </a>
              )
            })}
          </div>

          <button
            className="mobile-menu-button"
            type="button"
            aria-label="Open navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(open => !open)}
          >
            <Menu aria-hidden="true" />
          </button>
        </header>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {navItems.map(item => (
                <a
                  key={item.href}
                  className={item.href === displayedActiveHref ? "active" : undefined}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </a>
              ))}
              <span className="mobile-socials" aria-label="Social links">
                {socialLinks.map((link) => {
                  const Icon = socialIconMap[link.icon]

                  return (
                    <a className="icon-link" href={link.href} aria-label={link.label} key={link.label}>
                      <Icon aria-hidden="true" />
                    </a>
                  )
                })}
              </span>
            </motion.nav>
          )}
        </AnimatePresence>

        {route === "home" ? <HomePage prefersReducedMotion={prefersReducedMotion} /> : <ArchivePage route={route} />}

        <footer className="site-footer">
          <a className="brand" href="#home" onClick={() => handleNavClick("#home")}>{profile.shortName}</a>
          <span>© 2026. All Rights Reserved</span>
          <span>
            Built by
            {" "}
            {profile.name}
          </span>
        </footer>
      </div>
    </div>
  )
}

function HomePage({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  return (
    <main>
      <section id="home" className="hero" data-testid="hero">
        <motion.div
          className="hero-copy"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1>
            Hey There,
            <span>
              I&apos;m
              {" "}
              {profile.name}
            </span>
          </h1>
          <a className="email-link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </motion.div>

        <motion.p
          className="hero-note"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          I design beautifully simple things, and I love what I do.
        </motion.p>

        <motion.div
          className="portrait-wrap"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="paint-stroke paint-stroke-one" aria-hidden="true" />
          <div className="paint-stroke paint-stroke-two" aria-hidden="true" />
          <img src={assets.heroPortrait} alt={`${profile.name} portrait`} />
        </motion.div>

        <motion.div
          className="experience-badge"
          initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.28, duration: 0.65 }}
        >
          <strong>10</strong>
          <span>
            Years
            <br />
            Experience
          </span>
        </motion.div>

        <motion.div
          className="certification"
          initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.34, duration: 0.65 }}
        >
          <img src={assets.certifiedStamp} alt="IDF certified professional UI/UX designer" />
        </motion.div>
      </section>

      <SectionReveal id="about" className="section about-section">
        <div className="section-heading">
          <p className="eyebrow">About</p>
          <h2>About Samwel Omwenga</h2>
        </div>
        <div className="about-copy">
          <p>
            I build sharp, responsive web experiences with clear structure, readable interfaces, and careful attention to how content behaves across screen sizes.
          </p>
          <div className="about-highlights">
            {aboutHighlights.map(highlight => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="skills" className="section skills-section">
        <div className="skill-list">
          {skills.map((skill) => {
            const Icon = iconMap[skill.icon]

            return (
              <motion.article
                className="skill-card"
                data-tone={skill.tone}
                key={skill.title}
                whileHover={prefersReducedMotion ? undefined : { y: -5, scale: 1.01 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
              >
                <span className="skill-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span>
                  <strong>{skill.title}</strong>
                  <small>{skill.count}</small>
                </span>
              </motion.article>
            )
          })}
        </div>

        <div className="section-copy">
          <p className="eyebrow">Skills</p>
          <h2>What I bring to projects</h2>
          <p>
            I turn product ideas and personal brands into focused interfaces that are easy to scan, easy to use, and ready for real screens.
          </p>
          <p>
            My work balances front-end implementation, visual detail, accessibility, and responsive behavior so sections stay clear instead of fighting for space.
          </p>
          <div className="stats-grid">
            <span>
              <strong>3</strong>
              <small>Core Skill Areas</small>
            </span>
            <span>
              <strong>100%</strong>
              <small>Responsive Focus</small>
            </span>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="experience" className="section experience-section">
        <div className="section-heading row-heading">
          <div>
            <p className="eyebrow">Experience</p>
            <h2>Featured Experience</h2>
          </div>
          <a className="text-action" href="#/experience">
            More experience
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <ExperienceTimeline items={featuredExperience} />
      </SectionReveal>

      <SectionReveal id="projects" className="section projects-section">
        <div className="section-heading row-heading">
          <div>
            <p className="eyebrow">Projects</p>
            <h2>Featured Projects</h2>
            <p>Selected work shaped for clear digital experiences</p>
          </div>
          <a className="text-action" href="#/projects">
            More projects
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        <div className="projects-grid">
          {featuredProjects.map(project => (
            <ProjectCard key={project.title} project={project} prefersReducedMotion={prefersReducedMotion} />
          ))}
        </div>
      </SectionReveal>

      <SectionReveal id="blogs" className="section blogs-section">
        <div className="section-heading row-heading">
          <div>
            <p className="eyebrow">Blogs</p>
            <h2>Featured Blogs</h2>
          </div>
          <a className="text-action" href="#/blogs">
            More blogs
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <BlogList items={featuredBlogs} />
      </SectionReveal>

      <SectionReveal id="contact" className="section contact-section">
        <div className="contact-copy">
          <p className="eyebrow">Contact</p>
          <h2>Let&apos;s make something useful together.</h2>
          <p>
            Start by
            {" "}
            <a href={`mailto:${profile.email}`}>saying hi</a>
          </p>
        </div>
        <div className="contact-panel">
          <ContactForm />
        </div>
        <aside className="footer-info">
          <strong>Socials</strong>
          {socialLinks.map(link => (
            <a href={link.href} key={link.label}>{link.label}</a>
          ))}
        </aside>
      </SectionReveal>
    </main>
  )
}

function ArchivePage({ route }: { route: ArchiveRoute }) {
  if (route === "experience") {
    return <ExperienceArchive />
  }

  if (route === "projects") {
    return <ProjectsArchive />
  }

  return <BlogsArchive />
}

function ArchiveShell({ children, copy, eyebrow, icon: Icon, title }: {
  children: ReactNode
  copy: string
  eyebrow: string
  icon: LucideIcon
  title: string
}) {
  return (
    <main className="archive-main">
      <section className="archive-hero">
        <a className="text-action" href="#home">
          Home
          <ArrowUpRight aria-hidden="true" />
        </a>
        <span className="archive-icon" aria-hidden="true">
          <Icon />
        </span>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </section>
      {children}
    </main>
  )
}

function ExperienceArchive() {
  return (
    <ArchiveShell
      eyebrow="Experience"
      icon={Briefcase}
      title="All Experience"
      copy="The fuller path behind the featured roles on the home page."
    >
      <section className="section archive-section">
        <ExperienceTimeline items={experience} />
      </section>
    </ArchiveShell>
  )
}

function ProjectsArchive() {
  const [activeLens, setActiveLens] = useState<ProjectLens>("all")
  const filteredProjects = activeLens === "all" ? projects : projects.filter(project => project.lens === activeLens)

  return (
    <ArchiveShell
      eyebrow="Projects"
      icon={PenTool}
      title="Project Library"
      copy="A broader view of selected interface, web, and system work."
    >
      <section className="section archive-section">
        <LensRail
          active={activeLens}
          countFor={id => (id === "all" ? projects.length : projects.filter(project => project.lens === id).length)}
          onChange={id => setActiveLens(id as ProjectLens)}
          options={projectLenses}
        />
        <div className="projects-grid archive-projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard key={project.title} project={project} showDetails />
          ))}
        </div>
      </section>
    </ArchiveShell>
  )
}

function BlogsArchive() {
  const [activeLens, setActiveLens] = useState<BlogLens>("all")
  const filteredBlogs = activeLens === "all" ? blogs : blogs.filter(blog => blog.lens === activeLens)

  return (
    <ArchiveShell
      eyebrow="Blogs"
      icon={Newspaper}
      title="Blog Library"
      copy="Notes on process, interface decisions, and front-end implementation."
    >
      <section className="section archive-section">
        <LensRail
          active={activeLens}
          countFor={id => (id === "all" ? blogs.length : blogs.filter(blog => blog.lens === id).length)}
          onChange={id => setActiveLens(id as BlogLens)}
          options={blogLenses}
        />
        <BlogList items={filteredBlogs} showSummaries />
      </section>
    </ArchiveShell>
  )
}

function LensRail({ active, countFor, onChange, options }: {
  active: string
  countFor: (id: string) => number
  onChange: (id: string) => void
  options: readonly LensOption[]
}) {
  return (
    <div className="lens-rail" aria-label="Filter lenses">
      {options.map((option) => {
        const Icon = filterIconMap[option.icon]

        return (
          <button
            className="lens-button"
            data-active={option.id === active}
            key={option.id}
            type="button"
            aria-pressed={option.id === active}
            onClick={() => onChange(option.id)}
          >
            <Icon aria-hidden="true" />
            <span>
              <strong>{option.label}</strong>
              <small>{option.detail}</small>
            </span>
            <em>{countFor(option.id)}</em>
          </button>
        )
      })}
    </div>
  )
}

function ExperienceTimeline({ items }: { items: readonly ExperienceItem[] }) {
  return (
    <div className="timeline">
      {items.map(item => (
        <article className="timeline-row" key={`${item.company}-${item.role}`}>
          <div className="timeline-company">
            <h3>{item.company}</h3>
            <p>{item.date}</p>
          </div>
          <span className="timeline-pin" data-color={item.color} aria-hidden="true" />
          <div className="timeline-role">
            <h3>{item.role}</h3>
            <p>{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

function ProjectCard({ prefersReducedMotion, project, showDetails = false }: {
  prefersReducedMotion?: boolean | null
  project: (typeof projects)[number]
  showDetails?: boolean
}) {
  return (
    <motion.a
      className="project-card"
      data-tone={project.tone}
      href={project.href}
      aria-label={`Open ${project.title} project`}
      whileHover={prefersReducedMotion ? undefined : { y: -8, rotate: -0.6 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
    >
      <span className="project-copy">
        <span className="project-meta">{project.year}</span>
        <strong>{project.title}</strong>
        <small>{project.subtitle}</small>
        {showDetails && (
          <>
            <p>{project.summary}</p>
            <span className="tag-row">
              {project.tags.map(tag => (
                <em key={tag}>{tag}</em>
              ))}
            </span>
          </>
        )}
      </span>
      <img src={project.image} alt="" aria-hidden="true" />
    </motion.a>
  )
}

function BlogList({ items, showSummaries = false }: { items: readonly BlogItem[], showSummaries?: boolean }) {
  return (
    <div className="blogs-list">
      {items.map(blog => (
        <a href="#" className="blog-row" key={blog.title} aria-label={`Read ${blog.title}`}>
          <span>{blog.category}</span>
          <strong>{blog.title}</strong>
          {showSummaries && <p>{blog.summary}</p>}
          <small>
            {blog.date}
            {" / "}
            {blog.readTime}
          </small>
        </a>
      ))}
    </div>
  )
}

export default App
