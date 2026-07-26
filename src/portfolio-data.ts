import certifiedStamp from "@/assets/images/certified-stamp.webp"
import heroPortrait from "@/assets/images/hero-portrait.png"
import workApp from "@/assets/images/work-app.webp"
import workCollage from "@/assets/images/work-collage.webp"
import workWeb from "@/assets/images/work-web.webp"

export const assets = {
  heroPortrait,
  certifiedStamp,
}

export const profile = {
  name: "Samwel Omwenga",
  shortName: "Samwel",
  email: "banjan10@gmail.com",
  githubUrl: "https://github.com/samwelomwenga",
  linkedinUrl: "https://www.linkedin.com/in/samwelomwenga",
} as const

export const socialLinks = [
  { label: "GitHub", href: profile.githubUrl, icon: "github" },
  { label: "LinkedIn", href: profile.linkedinUrl, icon: "linkedin" },
  { label: "Email", href: `mailto:${profile.email}`, icon: "email" },
] as const

export const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Blogs", href: "#blogs" },
  { label: "Contact", href: "#contact" },
] as const

export const aboutPrinciples = [
  {
    title: "Design with build pressure in mind",
    copy: "I think about spacing, states, and responsive behavior early so the final interface survives real content.",
  },
  {
    title: "Keep the useful parts visible",
    copy: "Good UI should help someone decide faster, so I cut vague decoration and keep the next action obvious.",
  },
  {
    title: "Turn rough ideas into working screens",
    copy: "I move comfortably between structure, component logic, and visual polish until the page feels intentional.",
  },
] as const

export const aboutStats = [
  { value: "03", label: "Core focus areas" },
  { value: "06", label: "Project stories tracked" },
  { value: "100%", label: "Responsive review pass" },
] as const

export const skills = [
  {
    title: "Frontend Development",
    count: "React, TypeScript, Vite",
    tone: "teal",
    icon: "monitor",
  },
  {
    title: "Responsive UI",
    count: "Mobile-first layouts",
    tone: "yellow",
    icon: "smartphone",
  },
  {
    title: "Design Systems",
    count: "Reusable components",
    tone: "orange",
    icon: "badge",
  },
] as const

export const experience = [
  {
    company: "Independent Studio",
    date: "2024 - Present",
    role: "Frontend Developer",
    color: "teal",
    featured: true,
    description:
      "Builds responsive React interfaces, portfolio systems, and product pages with careful attention to layout stability and accessible interaction states.",
  },
  {
    company: "New Man Services",
    date: "2022 - 2024",
    role: "UI/UX Designer",
    color: "orange",
    featured: true,
    description:
      "Designed and refined web interfaces, reusable UI patterns, and handoff-ready screens for product and service workflows.",
  },
  {
    company: "Global Solution",
    date: "2020 - 2022",
    role: "Product Design Collaborator",
    color: "yellow",
    featured: true,
    description:
      "Worked across landing pages, user journeys, and brand-led interface concepts for digital campaigns and early product ideas.",
  },
  {
    company: "Digital Studio Lab",
    date: "2019 - 2020",
    role: "Web Support Specialist",
    color: "teal",
    featured: false,
    description:
      "Maintained marketing pages, corrected responsive bugs, and supported content updates across client-facing web properties.",
  },
  {
    company: "Creative Desk",
    date: "2018 - 2019",
    role: "Junior Web Designer",
    color: "orange",
    featured: false,
    description:
      "Prepared visual concepts, layout explorations, and simple front-end prototypes for portfolio and small business websites.",
  },
] as const

export const projects = [
  {
    title: "Mobile App Interface",
    subtitle: "Food delivery product flow",
    summary: "A compact ordering experience focused on fast menu scanning, checkout clarity, and repeat-user flows.",
    image: workApp,
    tone: "yellow",
    lens: "interface",
    year: "2026",
    tags: ["Mobile UI", "Ordering", "Prototype"],
    featured: true,
    href: "#",
  },
  {
    title: "Portfolio Website",
    subtitle: "Responsive personal brand site",
    summary: "A responsive portfolio system with section previews, archive pages, and motion that avoids layout collisions.",
    image: workWeb,
    tone: "teal",
    lens: "web",
    year: "2026",
    tags: ["React", "Responsive", "Portfolio"],
    featured: true,
    href: "#",
  },
  {
    title: "Identity System",
    subtitle: "Visual direction and UI kit",
    summary: "A practical identity kit translating brand direction into color, component, and layout rules.",
    image: workCollage,
    tone: "mint",
    lens: "system",
    year: "2025",
    tags: ["Brand", "Components", "Guidelines"],
    featured: true,
    href: "#",
  },
  {
    title: "Operations Dashboard",
    subtitle: "Metrics and status console",
    summary: "A dense dashboard concept for checking workload, recent activity, and priority signals at a glance.",
    image: workWeb,
    tone: "teal",
    lens: "web",
    year: "2025",
    tags: ["Dashboard", "Tables", "States"],
    featured: false,
    href: "#",
  },
  {
    title: "Booking Flow",
    subtitle: "Service scheduling journey",
    summary: "A service booking flow that reduces decision points while keeping date, package, and contact details visible.",
    image: workApp,
    tone: "yellow",
    lens: "interface",
    year: "2024",
    tags: ["Forms", "Scheduling", "UX"],
    featured: false,
    href: "#",
  },
  {
    title: "Component Kit",
    subtitle: "Reusable interface parts",
    summary: "A small design system covering buttons, cards, form fields, and empty states for consistent delivery.",
    image: workCollage,
    tone: "mint",
    lens: "system",
    year: "2024",
    tags: ["Design System", "UI Kit", "Tokens"],
    featured: false,
    href: "#",
  },
] as const

export const blogs = [
  {
    date: "24 Jan 2026",
    title: "Designing responsive sections without layout drift",
    category: "Process",
    lens: "process",
    readTime: "5 min",
    featured: true,
    summary: "How fixed section structure, measured breakpoints, and motion choices keep portfolio pages from colliding.",
  },
  {
    date: "12 Feb 2026",
    title: "Why simple portfolio interfaces convert",
    category: "Interface",
    lens: "interface",
    readTime: "4 min",
    featured: true,
    summary: "A note on making portfolio content easy to scan without reducing the work to a generic template.",
  },
  {
    date: "08 Mar 2026",
    title: "Working with identity systems in React",
    category: "Brand",
    lens: "build",
    readTime: "6 min",
    featured: true,
    summary: "A practical way to turn brand choices into reusable front-end decisions and maintainable components.",
  },
  {
    date: "18 Apr 2026",
    title: "Choosing breakpoints around content",
    category: "Build",
    lens: "build",
    readTime: "7 min",
    featured: false,
    summary: "Why responsive breakpoints should follow content pressure instead of device names alone.",
  },
  {
    date: "07 May 2026",
    title: "Making project cards easier to compare",
    category: "Interface",
    lens: "interface",
    readTime: "3 min",
    featured: false,
    summary: "Card structure, visual rhythm, and metadata choices that make project libraries easier to browse.",
  },
  {
    date: "19 Jun 2026",
    title: "A cleaner process for portfolio updates",
    category: "Process",
    lens: "process",
    readTime: "5 min",
    featured: false,
    summary: "How to keep a portfolio current by separating featured work, archives, and reusable content fields.",
  },
] as const
