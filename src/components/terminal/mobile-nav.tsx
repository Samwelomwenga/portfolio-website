import type { SectionId } from "@/portfolio-data"
import { SiGithub, SiX } from "@icons-pack/react-simple-icons"
import { Linkedin, Menu } from "lucide-react"
import { motion } from "motion/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { iconButtonMicroInteraction, linkMicroInteraction } from "@/lib/motion"
import { navItems, profile, socialLinks } from "@/portfolio-data"

type MobileNavProps = {
  activeId: string
  onNavigate: (id: SectionId) => void
}

const pages = navItems.filter(item => item.ready)

function SocialGlyph({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
  switch (icon) {
    case "github":
      return <SiGithub aria-hidden="true" className="size-4 text-[#181717]" title="" />
    case "linkedin":
      return <Linkedin aria-hidden="true" className="size-4 text-[#0A66C2] [stroke-width:2.2]" />
    case "x":
      return <SiX aria-hidden="true" className="size-4 text-[#000000]" title="" />
  }
}

/**
 * Below the `wide` breakpoint the Sidebar is hidden and the TabBar's tab strip is
 * hidden too, so this hamburger takes over as the primary nav: it opens a left
 * slide-in Sheet exposing the profile block, pages tree, and socials. Radix Dialog
 * (under shadcn Sheet) supplies focus trap, Esc, scroll-lock, and focus-return to
 * the trigger. The Sheet's slide is CSS (tw-animate-css), so it's guarded for
 * reduced motion here — `motion-reduce:animate-none` drops the slide to an instant
 * show, matching the app-wide `<MotionConfig reducedMotion="user">` posture.
 */
export function MobileNav({ activeId, onNavigate }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button
          type="button"
          aria-label="Open navigation menu"
          className="grid min-h-[2.375rem] w-[2.75rem] place-items-center border-r border-border text-muted transition-colors hover:text-fg wide:hidden"
          {...iconButtonMicroInteraction}
        >
          <Menu className="size-[1.125rem] [stroke-width:1.9]" aria-hidden="true" />
        </motion.button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="grid w-[min(20rem,84vw)] grid-rows-[auto_minmax(0,1fr)] gap-0 p-0 motion-reduce:animate-none! sm:max-w-none"
      >
        <SheetHeader className="gap-1 border-b border-border p-3.5 pr-14">
          <SheetTitle className="text-lg leading-tight font-extrabold text-fg">{profile.name}</SheetTitle>
          <SheetDescription className="text-xs break-words text-muted">{profile.workspaceMeta}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0">
          <nav className="p-2" aria-label="Portfolio sections">
            <div className="mb-3">
              <div className="px-2 py-1.5 text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">pages</div>
              {pages.map(item => (
                <SheetClose asChild key={item.id}>
                  <motion.button
                    type="button"
                    data-active={item.id === activeId}
                    aria-current={item.id === activeId ? "page" : undefined}
                    onClick={() => onNavigate(item.id)}
                    className="grid min-h-12 w-full grid-cols-[0.625rem_minmax(0,1fr)] items-center gap-x-2 gap-y-px rounded-sm px-2 py-1.5 text-left text-muted transition-colors hover:bg-surface/70 hover:text-fg data-[active=true]:bg-surface/85 data-[active=true]:text-fg"
                    {...linkMicroInteraction}
                  >
                    <span aria-hidden="true" className="row-span-2 mt-2 size-2 self-start rounded-full bg-[color:var(--card-accent)]" />
                    <span className="col-start-2 truncate text-[0.8125rem] leading-tight font-extrabold text-fg">{item.label}</span>
                    <span className="col-start-2 truncate text-[0.6875rem] leading-tight text-muted">{item.meta}</span>
                  </motion.button>
                </SheetClose>
              ))}
            </div>

            <div>
              <div className="px-2 py-1.5 text-[0.6875rem] font-extrabold tracking-[0.08em] text-muted uppercase">socials</div>
              {socialLinks.map(link => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid min-h-12 w-full grid-cols-[0.625rem_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-px rounded-sm px-2 py-1.5 text-left text-muted transition-colors hover:bg-surface/70 hover:text-fg"
                  {...linkMicroInteraction}
                >
                  <span aria-hidden="true" className="row-span-2 mt-2 size-2 self-start rounded-full bg-[color:var(--card-accent)]" />
                  <span className="col-start-2 truncate text-[0.8125rem] leading-tight font-extrabold text-fg">{link.label}</span>
                  <span className="col-start-2 truncate text-[0.6875rem] leading-tight text-muted">{link.meta}</span>
                  <span className="col-start-3 row-span-2 grid size-7 place-items-center self-center rounded-sm border border-border bg-white/95">
                    <SocialGlyph icon={link.icon} />
                  </span>
                </motion.a>
              ))}
            </div>
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
