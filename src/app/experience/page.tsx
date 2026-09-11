import type { Metadata } from "next"
import { ArchiveView } from "@/components/archive-view"

export const metadata: Metadata = {
  title: "All Experience | Samwel Omwenga",
  description: "The full timeline of Samwel Omwenga's software engineering roles and the work behind each.",
  alternates: { canonical: "/experience" },
}

export default function ExperiencePage() {
  return <ArchiveView type="experience" />
}
