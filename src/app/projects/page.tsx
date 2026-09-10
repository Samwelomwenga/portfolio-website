import type { Metadata } from "next"
import { ArchiveView } from "@/components/archive-view"

export const metadata: Metadata = {
  title: "Project Library | Samwel Omwenga",
  description: "A broader look at Samwel Omwenga's web apps and backend systems beyond the featured projects.",
  alternates: { canonical: "/projects" },
}

export default function ProjectsPage() {
  return <ArchiveView type="projects" />
}
