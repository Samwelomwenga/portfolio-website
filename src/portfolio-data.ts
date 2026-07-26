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

export const aboutHighlights = [
  "Focused on clean, responsive portfolio and product experiences.",
  "Comfortable moving from interface planning into polished front-end implementation.",
  "Keeps layouts readable across desktop, tablet, and mobile screens.",
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
    company: "Self-Employed, Brisbane",
    date: "Sep 2016 - Aug 2014",
    role: "Visual Designer",
    color: "teal",
    description:
      "A visual designer designs for a variety of platforms, which may include Internet and intranet sites, games, movies, kiosks and wearables. In short, they create the concepts.",
  },
  {
    company: "New Man Services",
    date: "Jan 17 - Mar 2018",
    role: "UI/UX Designer",
    color: "orange",
    description:
      "User interface design or user interface engineering is the design of user interfaces for machines and software, such as computers, home appliances, mobile devices.",
  },
  {
    company: "Global Solution",
    date: "Feb 2019 - Mar 2020",
    role: "Sr. Product Designer",
    color: "yellow",
    description:
      "Find Product Photography Canada. Large Selection. Always Sale. Cheap Prices. Full Offer. Save Online. Compare Online. Simple Search. The Best Price. Compare Simply.",
  },
] as const

export const projects = [
  {
    title: "Mobile App Interface",
    subtitle: "Food delivery product flow",
    image: workApp,
    tone: "yellow",
    href: "#",
  },
  {
    title: "Portfolio Website",
    subtitle: "Responsive personal brand site",
    image: workWeb,
    tone: "teal",
    href: "#",
  },
  {
    title: "Identity System",
    subtitle: "Visual direction and UI kit",
    image: workCollage,
    tone: "mint",
    href: "#",
  },
] as const

export const blogs = [
  {
    date: "24 Jan 2026",
    title: "Designing responsive sections without layout drift",
    category: "Process",
  },
  {
    date: "12 Feb 2026",
    title: "Why simple portfolio interfaces convert",
    category: "Interface",
  },
  {
    date: "08 Mar 2026",
    title: "Working with identity systems in React",
    category: "Brand",
  },
] as const
