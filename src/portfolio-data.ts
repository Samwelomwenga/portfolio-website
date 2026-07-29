export type StateColor = "yellow" | "pink" | "green" | "blue" | "cyan" | "orange"
export type StatusTone = "default" | "done" | "warn"

export const profile = {
  name: "Samwel Omwenga",
  shortName: "Samwel",
  title: "Software Engineer",
  email: "banjan10@gmail.com",
  githubUrl: "https://github.com/samwelomwenga",
  linkedinUrl: "https://www.linkedin.com/in/samwelomwenga",
  workspaceMeta: "portfolio / main / software-engineer",
} as const

export const socialLinks = [
  { label: "github", href: profile.githubUrl, meta: "code · projects", icon: "github", state: "yellow" },
  { label: "linkedin", href: profile.linkedinUrl, meta: "profile · work", icon: "linkedin", state: "pink" },
  { label: "email", href: `mailto:${profile.email}`, meta: profile.email, icon: "email", state: "blue" },
] as const

export const navItems = [
  { id: "home", tab: "~/home", label: "home", meta: "main · overview", state: "yellow", command: "$ ./introduce" },
  { id: "about", tab: "~/about", label: "about", meta: "bio · working style", state: "pink", command: "$ cat about.md" },
  { id: "skills", tab: "~/skills", label: "skills", meta: "stack · grouped", state: "green", command: "$ list --grouped" },
  { id: "experience", tab: "~/experience", label: "experience", meta: "timeline · current", state: "blue", command: "$ tail experience.log" },
  { id: "projects", tab: "~/projects", label: "projects", meta: "case studies · visual", state: "cyan", command: "$ open projects.cards" },
  { id: "blogs", tab: "~/blogs", label: "blogs", meta: "drafts · notes", state: "orange", command: "$ open blog.index" },
  { id: "contact", tab: "~/contact", label: "contact", meta: "email · socials", state: "green", command: "$ ./contact.sh" },
] as const

export type SectionId = (typeof navItems)[number]["id"]

export const hero = {
  firstName: "Samwel",
  lastName: "Omwenga",
  about:
    "I build web and mobile products that turn ideas into stable, polished interfaces. I focus on React, TypeScript, and responsive front-end systems that stay production-ready as the real content arrives.",
} as const

export const assistantPrompts = [
  { label: "recruiter summary", prompt: "Summarize my best projects for a recruiter" },
  { label: "stack overview", prompt: "Explain my React and web experience" },
  { label: "client intro", prompt: "Write a short intro for a client conversation" },
] as const

export const assistantSeedPrompt = "Summarize my strongest project work"

export const assistantResponses = {
  recruiter:
    "Samwel Omwenga builds practical product interfaces across web and mobile, with a focus on React, TypeScript, responsive systems, and developer-ready UI details.",
  stack:
    "The stack story is frontend-heavy and implementation-minded: React screens, TypeScript structure, responsive layouts, dashboard states, and reusable design-system components.",
  client:
    "Hi, I build clean software interfaces that turn product ideas into usable web and mobile experiences. I can help shape the UX and ship the front-end implementation.",
  fallback:
    "I can summarize projects, rewrite the intro for a specific audience, surface matching skills, or turn the portfolio sections into a concise pitch.",
} as const

export const aboutCards = [
  {
    kicker: "Local",
    title: "current focus",
    body: "I design and build reliable product interfaces, with attention to state, motion, implementation details, and the small moments that make software feel finished.",
    state: "blue",
  },
  {
    kicker: "Over SSH",
    title: "working style",
    body: "I think about spacing, states, and responsive behavior early so the final interface survives real content, then keep the useful parts visible with a clean handoff.",
    state: "green",
  },
] as const

export const skillGroups = [
  {
    kicker: "Local",
    title: "frontend",
    state: "blue",
    tags: ["React", "TypeScript", "Vite", "CSS systems", "accessibility"],
  },
  {
    kicker: "Over SSH",
    title: "product",
    state: "green",
    tags: ["responsive UI", "design systems", "prototyping", "dashboards", "handoff"],
  },
  {
    kicker: "Thin client",
    title: "tooling",
    state: "yellow",
    tags: ["Tailwind", "Motion", "Playwright", "component APIs", "testing"],
  },
] as const

export type ExperienceItem = {
  company: string
  period: string
  role: string
  description: string
  state: StateColor
  featured: boolean
}

export const experience: readonly ExperienceItem[] = [
  {
    company: "Independent Studio",
    period: "2024 - Present",
    role: "Frontend Developer",
    description:
      "Builds responsive React interfaces, portfolio systems, and product pages with careful attention to layout stability and accessible interaction states.",
    state: "blue",
    featured: true,
  },
  {
    company: "New Man Services",
    period: "2022 - 2024",
    role: "UI/UX Designer",
    description:
      "Designed and refined web interfaces, reusable UI patterns, and handoff-ready screens for product and service workflows.",
    state: "orange",
    featured: true,
  },
  {
    company: "Global Solution",
    period: "2020 - 2022",
    role: "Product Design Collaborator",
    description:
      "Worked across landing pages, user journeys, and brand-led interface concepts for digital campaigns and early product ideas.",
    state: "yellow",
    featured: true,
  },
  {
    company: "Digital Studio Lab",
    period: "2019 - 2020",
    role: "Web Support Specialist",
    description:
      "Maintained marketing pages, corrected responsive bugs, and supported content updates across client-facing web properties.",
    state: "green",
    featured: false,
  },
  {
    company: "Creative Desk",
    period: "2018 - 2019",
    role: "Junior Web Designer",
    description:
      "Prepared visual concepts, layout explorations, and simple front-end prototypes for portfolio and small business websites.",
    state: "pink",
    featured: false,
  },
]

export type ProjectItem = {
  title: string
  blurb: string
  filter: "app" | "web" | "system"
  statusLabel: string
  statusTone: StatusTone
  typeLabel: string
  state: StateColor
  featured: boolean
}

export const projects: readonly ProjectItem[] = [
  {
    title: "Mobile App Interface",
    blurb: "A compact ordering experience focused on fast menu scanning, checkout clarity, and repeat-user flows.",
    filter: "app",
    statusLabel: "case study",
    statusTone: "done",
    typeLabel: "mobile app",
    state: "blue",
    featured: true,
  },
  {
    title: "Portfolio Terminal",
    blurb: "A responsive portfolio system with themeable navigation, compact panes, and motion that avoids layout collisions.",
    filter: "web",
    statusLabel: "live",
    statusTone: "done",
    typeLabel: "web system",
    state: "green",
    featured: true,
  },
  {
    title: "Identity System",
    blurb: "A practical identity kit translating brand direction into color, component, and layout rules.",
    filter: "system",
    statusLabel: "case study",
    statusTone: "done",
    typeLabel: "design system",
    state: "cyan",
    featured: true,
  },
  {
    title: "Operations Dashboard",
    blurb: "A dense dashboard concept for checking workload, recent activity, and priority signals at a glance.",
    filter: "web",
    statusLabel: "draft",
    statusTone: "default",
    typeLabel: "dashboard",
    state: "pink",
    featured: false,
  },
  {
    title: "Booking Flow",
    blurb: "A service booking flow that reduces decision points while keeping date, package, and contact details visible.",
    filter: "app",
    statusLabel: "planned",
    statusTone: "warn",
    typeLabel: "product flow",
    state: "yellow",
    featured: false,
  },
  {
    title: "Component Kit",
    blurb: "A small design system covering buttons, cards, form fields, and empty states for consistent delivery.",
    filter: "system",
    statusLabel: "live",
    statusTone: "done",
    typeLabel: "ui kit",
    state: "orange",
    featured: false,
  },
]

export const projectFilters = [
  { id: "all", label: "all" },
  { id: "app", label: "apps" },
  { id: "web", label: "web" },
  { id: "system", label: "systems" },
] as const

export type ProjectFilter = (typeof projectFilters)[number]["id"]

export type BlogItem = {
  title: string
  blurb: string
  meta: string
  filter: "process" | "interface" | "engineering"
  state: StateColor
  featured: boolean
}

export const blogs: readonly BlogItem[] = [
  {
    title: "Designing responsive sections without layout drift",
    blurb: "How fixed section structure, measured breakpoints, and motion choices keep portfolio pages from colliding.",
    meta: "draft / process",
    filter: "process",
    state: "cyan",
    featured: true,
  },
  {
    title: "Why simple portfolio interfaces convert",
    blurb: "A note on making portfolio content easy to scan without reducing the work to a generic template.",
    meta: "draft / interface craft",
    filter: "interface",
    state: "pink",
    featured: true,
  },
  {
    title: "Working with identity systems in React",
    blurb: "A practical way to turn brand choices into reusable front-end decisions and maintainable components.",
    meta: "draft / engineering",
    filter: "engineering",
    state: "yellow",
    featured: true,
  },
  {
    title: "Choosing breakpoints around content",
    blurb: "Why responsive breakpoints should follow content pressure instead of device names alone.",
    meta: "draft / engineering",
    filter: "engineering",
    state: "blue",
    featured: false,
  },
  {
    title: "Making project cards easier to compare",
    blurb: "Card structure, visual rhythm, and metadata choices that make project libraries easier to browse.",
    meta: "draft / interface craft",
    filter: "interface",
    state: "green",
    featured: false,
  },
  {
    title: "A cleaner process for portfolio updates",
    blurb: "How to keep a portfolio current by separating featured work, archives, and reusable content fields.",
    meta: "draft / process",
    filter: "process",
    state: "orange",
    featured: false,
  },
]

export const blogFilters = [
  { id: "all", label: "all" },
  { id: "process", label: "process" },
  { id: "interface", label: "interface" },
  { id: "engineering", label: "engineering" },
] as const

export type BlogFilter = (typeof blogFilters)[number]["id"]

export const contactCommands = [
  { command: "open github.com/samwelomwenga", action: "github", href: profile.githubUrl },
  { command: "open linkedin.com/in/samwelomwenga", action: "linkedin", href: profile.linkedinUrl },
  { command: `mailto ${profile.email}`, action: "copy", href: null },
] as const
