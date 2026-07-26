import certifiedStamp from "@/assets/images/certified-stamp.webp"
import heroPortrait from "@/assets/images/hero-portrait.png"
import workApp from "@/assets/images/work-app.webp"
import workCollage from "@/assets/images/work-collage.webp"
import workWeb from "@/assets/images/work-web.webp"

export const assets = {
  heroPortrait,
  certifiedStamp,
}

export const navItems = [
  { label: "Services", href: "#services" },
  { label: "Works", href: "#works" },
  { label: "Notes", href: "#notes" },
  { label: "Experience", href: "#experience" },
] as const

export const services = [
  {
    title: "Website Design",
    count: "76 Projects",
    tone: "teal",
    icon: "monitor",
  },
  {
    title: "Mobile App Design",
    count: "63 Projects",
    tone: "yellow",
    icon: "smartphone",
  },
  {
    title: "Brand Identity",
    count: "47 Projects",
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

export const works = [
  {
    title: "App Design",
    subtitle: "Food Delivery App",
    image: workApp,
    tone: "yellow",
    href: "#",
  },
  {
    title: "Web Design",
    subtitle: "Agency Website",
    image: workWeb,
    tone: "teal",
    href: "#",
  },
  {
    title: "Brand Identity",
    subtitle: "Brand Identity",
    image: workCollage,
    tone: "mint",
    href: "#",
  },
] as const

export const testimonials = [
  {
    name: "John Allendane",
    role: "Creative manager",
    quote:
      "A complete search of the internet has found these results satisfactory result is the most popular phrase on the web.",
    avatar: "JA",
    color: "yellow",
  },
  {
    name: "Anamika Sandula",
    role: "Project manager",
    quote:
      "A complete search of the internet has found these results satisfactory result is the most popular phrase on the web.",
    avatar: "AS",
    color: "teal",
  },
  {
    name: "Souther Hakcax",
    role: "Marketing manager",
    quote:
      "A complete search of the internet has found these results satisfactory result is the most popular phrase on the web.",
    avatar: "SH",
    color: "orange",
  },
] as const

export const notes = [
  {
    date: "24 Jan 2026",
    title: "Designing calm product decisions",
    category: "Process",
  },
  {
    date: "12 Feb 2026",
    title: "Why simple interfaces convert",
    category: "Interface",
  },
  {
    date: "08 Mar 2026",
    title: "Working with identity systems",
    category: "Brand",
  },
] as const
