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
    "I'm a full-stack engineer who builds tools people rely on every day. I work across the stack — React and Next.js on the front end, .NET Core and Postgres on the back — mostly on an academic platform used by teachers, students, and parents.",
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
  "I'm a full-stack engineer based in Nairobi. I work on an academic platform used by teachers, students, and parents. Most of my work turns slow, manual tasks into simple, automated ones. The people using it aren't engineers, so I keep the screens clear and the data correct.",
  "I build the front end with React, Next.js, React Native, and TypeScript. For data, forms, and URL state I use TanStack Query, React Hook Form, and nuqs. On the back end I work with .NET Core and Postgres. I care most about the front end, where the work is actually used, but I handle the full stack.",
  "I'm practical about how I build. I weigh user experience, maintainability, and deadlines, and I ship. I've also trained interns into developers who shipped real features, and helped raise the team's front-end standards through code reviews and shared patterns. Next, I want more full-stack ownership and deeper work on architecture.",
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
      "I work across a live academic platform — the Next.js portals teachers, students, and parents use, and the .NET Core services and internal tools behind them. Most of my work turns a manual task into something simple and automatic.",
    points: [
      "Built AI features that give people a starting point instead of a blank page — draft lesson steps for teachers, and clear explanations for students on why they missed a question.",
      "Helped move the academic module from a legacy stack to Next.js and .NET Core. The platform got faster and broke less often, which cut down support calls.",
      "Made lesson planning less repetitive: the next lesson number now fills in from the previous plan, and Scheme of Work creation went from two steps to one.",
      "Replaced monthly manual reminder calls and hand-done account closures with automatic reminders and access control, so subscriptions run on a set workflow.",
      "Built dashboards for admins, teachers, students, and parents that turn platform activity into clear signals — who's active, who's behind, and where a teacher should step in.",
      "Trained interns into developers who shipped real features on the student and parent portals, and helped raise the team's front-end standards through code reviews and shared patterns.",
    ],
    state: "blue",
    featured: true,
  },
]

export type ProjectItem = {
  title: string
  blurb: string
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
    statusLabel: "live",
    statusTone: "done",
    typeLabel: "web app",
    state: "blue",
    featured: true,
  },
  {
    title: "eTIMS Integration",
    blurb: "Integrated Kenya's eTIMS e-invoicing into internal software with .NET Core, improving tax-invoice data accuracy and synchronization for clients.",
    statusLabel: "live",
    statusTone: "done",
    typeLabel: "backend",
    state: "green",
    featured: true,
  },
  {
    title: "Portfolio Terminal",
    blurb: "This site — a themeable, terminal-style portfolio built with React, TypeScript, and Tailwind CSS.",
    statusLabel: "live",
    statusTone: "done",
    typeLabel: "web system",
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
