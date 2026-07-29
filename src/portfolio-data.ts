export type StateColor = "yellow" | "pink" | "green" | "blue" | "cyan" | "orange"
export type StatusTone = "default" | "done" | "warn"

export const profile = {
  name: "Samwel Omwenga",
  shortName: "Samwel",
  title: "Software Engineer",
  email: "banjan10@gmail.com",
  githubUrl: "https://github.com/samwelomwenga",
  linkedinUrl: "https://www.linkedin.com/in/samwelomwenga",
  xUrl: "https://x.com/Samwel_codes",
  location: "Nairobi, Kenya",
  workspaceMeta: "portfolio / main / software-developer",
} as const

export const socialLinks = [
  { label: "github", href: profile.githubUrl, meta: "code · projects", icon: "github", state: "yellow" },
  { label: "linkedin", href: profile.linkedinUrl, meta: "profile · work", icon: "linkedin", state: "pink" },
  { label: "x", href: profile.xUrl, meta: "posts · updates", icon: "x", state: "cyan" },
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
    "Software engineer building scalable web and mobile products with modern frontend and backend technologies. I focus on responsive interfaces, secure APIs, third-party integrations, and reliable end-to-end solutions.",
} as const

export const assistantPrompts = [
  { label: "recruiter summary", prompt: "Summarize my best projects for a recruiter" },
  { label: "stack overview", prompt: "Explain my software engineering experience" },
  { label: "client intro", prompt: "Write a short intro for a client conversation" },
] as const

export const assistantSeedPrompt = "Summarize my strongest project work"

export const assistantResponses = {
  recruiter:
    "Samwel Omwenga is a software engineer at Africa Cloud Space, building scalable web and mobile products with Next.js, React Native, and .NET Core — from responsive UIs to secure APIs and third-party integrations.",
  stack:
    "Frontend: React, Next.js, React Native, TypeScript, and Tailwind CSS. Backend: .NET Core, EF Core, and Postgres. Tooling: Supabase, Firebase, Git, and Figma. AWS Certified Cloud Practitioner and KCNA.",
  client:
    "Hi, I'm Samwel — a software engineer who turns product ideas into reliable web and mobile experiences, end to end. I can help shape the UX and ship the implementation.",
  fallback:
    "I can summarize projects, rewrite the intro for a specific audience, surface matching skills, or turn the portfolio sections into a concise pitch.",
} as const

export const aboutParagraphs = [
  "Full-stack developer experienced in building scalable applications using modern frontend and backend technologies. Skilled in developing responsive user interfaces, designing secure APIs, integrating third-party services, and delivering reliable end-to-end solutions.",
  "I enjoy collaborating with cross-functional teams to create intuitive digital experiences and continuously improve application performance, usability, and maintainability.",
] as const

export const skillGroups = [
  {
    title: "languages",
    state: "blue",
    tags: ["HTML5", "CSS3", "JavaScript", "TypeScript", "C#", "Postgres"],
  },
  {
    title: "frameworks",
    state: "green",
    tags: ["React", "Next.js", "React Native", "Expo Router", "Tailwind CSS", ".NET Core", "EF Core"],
  },
  {
    title: "tools",
    state: "yellow",
    tags: ["Git", "Postman", "Figma", "Supabase", "Firebase"],
  },
] as const

export const certifications = ["AWS Certified Cloud Practitioner", "Kubernetes & Cloud Native Associate"] as const

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
    company: "Africa Cloud Space",
    period: "Present",
    role: "Full-Stack Developer",
    description:
      "Led the redesign of the parent and student portal in Next.js with AI-powered revision tools, personalized learning pathways, performance analytics, and gamification, and integrated Kenya's eTIMS e-invoicing via .NET Core to improve tax-invoice accuracy and synchronization.",
    state: "blue",
    featured: true,
  },
]

export type ProjectItem = {
  title: string
  blurb: string
  filter: "web" | "system"
  statusLabel: string
  statusTone: StatusTone
  typeLabel: string
  state: StateColor
  featured: boolean
}

export const projects: readonly ProjectItem[] = [
  {
    title: "Learning Portal Redesign",
    blurb: "Rebuilt Africa Cloud Space's parent and student portal in Next.js with AI-powered revision tools, personalized learning pathways, analytics, and gamification.",
    filter: "web",
    statusLabel: "live",
    statusTone: "done",
    typeLabel: "web app",
    state: "blue",
    featured: true,
  },
  {
    title: "eTIMS Integration",
    blurb: "Integrated Kenya's eTIMS e-invoicing into internal software with .NET Core, improving tax-invoice data accuracy and synchronization for clients.",
    filter: "system",
    statusLabel: "live",
    statusTone: "done",
    typeLabel: "backend",
    state: "green",
    featured: true,
  },
  {
    title: "Portfolio Terminal",
    blurb: "This site — a themeable, terminal-style portfolio built with React, TypeScript, and Tailwind CSS.",
    filter: "web",
    statusLabel: "live",
    statusTone: "done",
    typeLabel: "web system",
    state: "cyan",
    featured: false,
  },
]

export const projectFilters = [
  { id: "all", label: "all" },
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
    title: "Building AI revision tools in Next.js",
    blurb: "Notes on wiring learning-science features — revision tools, pathways, and analytics — into a responsive Next.js portal.",
    meta: "draft / engineering",
    filter: "engineering",
    state: "cyan",
    featured: true,
  },
  {
    title: "Designing responsive learning dashboards",
    blurb: "How layout structure and clear states keep dense analytics dashboards readable across screen sizes.",
    meta: "draft / interface craft",
    filter: "interface",
    state: "pink",
    featured: true,
  },
  {
    title: "Integrating eTIMS with .NET Core",
    blurb: "A practical write-up on connecting internal software to Kenya's eTIMS e-invoicing with accurate, synchronized data.",
    meta: "draft / engineering",
    filter: "engineering",
    state: "yellow",
    featured: true,
  },
  {
    title: "React Native navigation with Expo Router",
    blurb: "Structuring mobile navigation and shared layouts using Expo Router in a React Native app.",
    meta: "draft / engineering",
    filter: "engineering",
    state: "blue",
    featured: false,
  },
  {
    title: "Postgres and Supabase for rapid product builds",
    blurb: "Using Postgres and Supabase to move from idea to a working, secure backend quickly.",
    meta: "draft / engineering",
    filter: "engineering",
    state: "green",
    featured: false,
  },
  {
    title: "Shipping a themeable terminal portfolio",
    blurb: "Design and build notes on this site — tokens, theming, and a terminal-style layout in React and Tailwind.",
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
