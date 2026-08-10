import type { ArchiveRoute } from "@/lib/routes"
import { ArchiveLink } from "@/components/archive-link"
import { BlogGrid } from "@/components/blog-grid"
import { RollingText } from "@/components/motion/rolling-text"
import { Screen, SectionHeading } from "@/components/screen-shell"
import { ARCHIVE_THRESHOLD } from "@/lib/archive"
import { blogs } from "@/portfolio-data"

type BlogsScreenProps = {
  onArchive: (route: ArchiveRoute) => void
}

const featuredBlogs = blogs.filter(blog => blog.featured)

export function BlogsScreen({ onArchive }: BlogsScreenProps) {
  return (
    <Screen id="blogs">
      <div className="flex flex-col items-start justify-between gap-4 wide:flex-row wide:items-end">
        <SectionHeading title="Blogs" headingId="screen-blogs-title">
          <RollingText text="A lean index of writing on process, interface craft, and implementation." split="words" />
        </SectionHeading>
        {blogs.length > ARCHIVE_THRESHOLD && <ArchiveLink onClick={() => onArchive("blogs")}>More blogs</ArchiveLink>}
      </div>
      <BlogGrid items={featuredBlogs} />
    </Screen>
  )
}
