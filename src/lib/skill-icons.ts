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
import { Database } from "lucide-react"

export type SkillIconEntry = {
  Icon: typeof SiReact | typeof Database
  iconClass: string
}

export const skillIcons: Record<string, SkillIconEntry> = {
  "HTML5": { Icon: SiHtml5, iconClass: "text-[#E34F26]" },
  "CSS3": { Icon: SiCss, iconClass: "text-[#1572B6]" },
  "JavaScript": { Icon: SiJavascript, iconClass: "text-[#F7DF1E]" },
  "TypeScript": { Icon: SiTypescript, iconClass: "text-[#3178C6]" },
  "C#": { Icon: SiDotnet, iconClass: "text-[#512BD4]" },
  "Postgres": { Icon: SiPostgresql, iconClass: "text-[#4169E1]" },
  "Microsoft SQL": { Icon: Database, iconClass: "text-[#CC2927]" },
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
}
