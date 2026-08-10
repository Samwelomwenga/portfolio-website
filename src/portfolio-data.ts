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
  workspaceMeta: "portfolio / main / software-engineer",
} as const

export const socialLinks = [
  { label: "github", href: profile.githubUrl, meta: "code · projects", icon: "github", state: "yellow" },
  { label: "linkedin", href: profile.linkedinUrl, meta: "profile · work", icon: "linkedin", state: "pink" },
  { label: "x", href: profile.xUrl, meta: "posts · updates", icon: "x", state: "cyan" },
] as const

export const navItems = [
  { id: "home", tab: "~/home", label: "home", meta: "main · overview", state: "yellow", command: "$ ./introduce", ready: true },
  { id: "about", tab: "~/about", label: "about", meta: "bio · working style", state: "pink", command: "$ cat about.md", ready: true },
  { id: "skills", tab: "~/skills", label: "skills", meta: "stack · grouped", state: "green", command: "$ list --grouped", ready: true },
  { id: "experience", tab: "~/experience", label: "experience", meta: "timeline · current", state: "blue", command: "$ tail experience.log", ready: true },
  { id: "projects", tab: "~/projects", label: "projects", meta: "case studies · visual", state: "cyan", command: "$ open projects.cards", ready: true },
  { id: "blogs", tab: "~/blogs", label: "blogs", meta: "drafts · notes", state: "orange", command: "$ open blog.index", ready: false },
  { id: "contact", tab: "~/contact", label: "contact", meta: "email · socials", state: "green", command: "$ ./contact.sh", ready: true },
] as const

export type SectionId = (typeof navItems)[number]["id"]

export const hero = {
  firstName: "Samwel",
  lastName: "Omwenga",
  about:
    "I'm a software engineer passionate about creating intuitive, user-focused solutions. I design and build engaging interfaces for web and mobile alongside highly available, scalable backend systems, and I work closely with cross-functional teams to turn complex business needs into reliable software.",
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
  "Hello, I am Samwel Omwenga, a software engineer passionate about creating intuitive, user-focused solutions. I have a proven ability to design and implement engaging interfaces for both web and mobile platforms using React and React Native, and to build highly available, scalable backend systems with .NET Core, Microsoft SQL, and PostgreSQL. I excel at collaborating with cross-functional teams, leveraging strong communication and problem-solving skills to translate complex business needs into effective, reliable software solutions.",
  "I have a proven record of building a multi-curriculum edtech ERP system that reduces the manual workload for teachers, such as creating lesson plans and assessments, and provides insightful analysis, reports, and suggestions to support informed decision-making. I implemented an online learning interface where students can access revision materials, take assessments, and receive timely feedback, which increases student academic results by providing personalized learning resources and timely feedback. Additionally, I developed dashboards and reports within the system that use AI-generated learning science insights, analysis, and reports to help students, teachers, and parents monitor progress and identify areas that need additional support.",
  "Score disputes should not weigh down pool table games during play or confuse the math at the end of money match games; that is why, besides my core work, I am building Chalk App. This React Native and ASP.NET Core application handles real-time game tracking and complex post-money-match-game calculations for 8-ball and points games. By automating the ledger, it ensures players can focus entirely on the table — less talk, more chalk during the games while Chalk App handles the math.",
] as const

export const skillGroups = [
  {
    title: "languages",
    state: "blue",
    tags: ["HTML5", "CSS3", "JavaScript", "TypeScript", "C#", "Postgres", "Microsoft SQL"],
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

export type Certification = {
  name: string
  /**
   * Optional verification URL (e.g. a Credly badge). When present, the pill
   * becomes a link that opens in a new tab; without it the pill stays plain.
   */
  href?: string
  imageSrc?: string
}

export const certifications: readonly Certification[] = [
  {
    name: "AWS Certified Cloud Practitioner",
    href: "https://www.credly.com/badges/c77b467a-8caf-4353-9a0c-16a5f4813053/public_url",
    imageSrc: "https://images.credly.com/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png",
  },
  {
    name: "Kubernetes & Cloud Native Associate",
    href: "https://www.credly.com/badges/3bb41b76-1db3-4d24-9f7c-1db6caca8311/public_url",
    imageSrc: "https://images.credly.com/images/f28f1d88-428a-47f6-95b5-7da1dd6c1000/KCNA_badge.png",
  },
]

export type ExperienceItem = {
  company: string
  period: string
  role: string
  description: string
  /** Optional highlight bullets shown under the description. */
  points?: readonly string[]
  state: StateColor
  featured: boolean
}

export const experience: readonly ExperienceItem[] = [
  {
    company: "Africa Cloud Space",
    period: "Present",
    role: "Full-Stack Developer",
    description:
      "I work on the  academic platform, building intuitive portals for teachers, students, and parents while also developing the internal services that support them. I specialize in turning time-consuming, manual tasks into seamless, automated workflows that make the platform more efficient for everyone.",
    points: [
      "Developed AI-powered features to assist with lesson planning and student revision, reducing teacher workload and improving learning outcomes.",
      "Collaborated on the migration of the academic module to a modern technology stack, enhancing platform stability and customer satisfaction.",
      "Mentored interns and new developers, accelerating onboarding and maintaining high standards for code quality and architecture.",
      "Designed and implemented an internal subscription management system, automating renewals and access control to reduce operational overhead and improve revenue reliability.",
      "Built and maintained dashboards to provide actionable insights for teachers, students, parents, and administrators, supporting data-driven decision-making.",
      "Participated in code reviews, architecture discussions, and cross-functional team collaboration to ensure high-quality, maintainable solutions.",
      "Trained teachers on new product features, increasing adoption and reducing support calls through hands-on enablement and regular feedback sessions",
    ],
    state: "blue",
    featured: true,
  },
]

export type ProjectKind = "backend" | "web" | "mobile"
export type ProjectStatus = "live" | "testing"

/**
 * Action links for a project — every key is independently optional and the card
 * renders only the ones present. For `testing` projects, `playStore` / `appStore`
 * relabel as the join-testing CTA (Play internal testing / TestFlight).
 */
export type ProjectLinks = {
  github?: string
  swagger?: string
  web?: string
  playStore?: string
  appStore?: string
}

export type ProjectItem = {
  title: string
  blurb: string
  /** Primary classifier; does not gate which links are shown. */
  kind: ProjectKind
  /** Free display text, shown alongside the status pill. */
  typeLabel: string
  status: ProjectStatus
  links?: ProjectLinks
  stack: readonly string[]
  state: StateColor
  featured: boolean
}

/** Derives the status pill's label and tone from a project's `status`. */
export const projectStatusMeta: Record<ProjectStatus, { label: string, tone: StatusTone }> = {
  live: { label: "live", tone: "done" },
  testing: { label: "testing", tone: "warn" },
}

export const projects: readonly ProjectItem[] = [
  {
    title: "Learning Portal Redesign",
    blurb: "Rebuilt Africa Cloud Space's parent and student portal in Next.js with AI-powered revision tools, personalized learning pathways, analytics, and gamification.",
    kind: "web",
    typeLabel: "web app",
    status: "live",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    state: "blue",
    featured: true,
  },
  {
    title: "eTIMS Integration",
    blurb: "Integrated Kenya's eTIMS e-invoicing into internal software with .NET Core, improving tax-invoice data accuracy and synchronization for clients.",
    kind: "backend",
    typeLabel: "backend",
    status: "live",
    stack: [".NET Core", "EF Core", "Postgres"],
    state: "green",
    featured: true,
  },
  {
    title: "Portfolio Terminal",
    blurb: "This site — a themeable, terminal-style portfolio built with React, TypeScript, and Tailwind CSS.",
    kind: "web",
    typeLabel: "web system",
    status: "live",
    links: {
      github: "https://github.com/Samwelomwenga/portfolio-website",
    },
    stack: ["React", "TypeScript", "Tailwind CSS"],
    state: "cyan",
    featured: false,
  },
]

export type BlogItem = {
  title: string
  blurb: string
  meta: string
  state: StateColor
  featured: boolean
}

export const blogs: readonly BlogItem[] = [
  {
    title: "Building AI revision tools in Next.js",
    blurb: "Notes on wiring learning-science features — revision tools, pathways, and analytics — into a responsive Next.js portal.",
    meta: "draft / engineering",
    state: "cyan",
    featured: true,
  },
  {
    title: "Designing responsive learning dashboards",
    blurb: "How layout structure and clear states keep dense analytics dashboards readable across screen sizes.",
    meta: "draft / interface craft",
    state: "pink",
    featured: true,
  },
  {
    title: "Integrating eTIMS with .NET Core",
    blurb: "A practical write-up on connecting internal software to Kenya's eTIMS e-invoicing with accurate, synchronized data.",
    meta: "draft / engineering",
    state: "yellow",
    featured: true,
  },
  {
    title: "React Native navigation with Expo Router",
    blurb: "Structuring mobile navigation and shared layouts using Expo Router in a React Native app.",
    meta: "draft / engineering",
    state: "blue",
    featured: false,
  },
  {
    title: "Postgres and Supabase for rapid product builds",
    blurb: "Using Postgres and Supabase to move from idea to a working, secure backend quickly.",
    meta: "draft / engineering",
    state: "green",
    featured: false,
  },
  {
    title: "Shipping a themeable terminal portfolio",
    blurb: "Design and build notes on this site — tokens, theming, and a terminal-style layout in React and Tailwind.",
    meta: "draft / process",
    state: "orange",
    featured: false,
  },
]

export const contactCommands = [
  { command: "open github.com/samwelomwenga", action: "github", href: profile.githubUrl },
  { command: "open linkedin.com/in/samwelomwenga", action: "linkedin", href: profile.linkedinUrl },
  { command: "open x.com/Samwel_codes", action: "x", href: profile.xUrl },
] as const
