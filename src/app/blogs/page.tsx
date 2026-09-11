import type { Metadata } from "next"
import { ArchiveView } from "@/components/archive-view"

export const metadata: Metadata = {
  title: "Blog Library | Samwel Omwenga",
  description: "Writing by Samwel Omwenga on process, interface craft, and front-end implementation.",
  alternates: { canonical: "/blogs" },
}

export default function BlogsPage() {
  return <ArchiveView type="blogs" />
}
