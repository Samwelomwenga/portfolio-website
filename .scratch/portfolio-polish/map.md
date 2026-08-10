# Portfolio Polish

`wayfinder:map` · effort slug `portfolio-polish` · branch `feat/portfolio-polish`

## Destination

A locked spec (with the trivial threads already applied) for a batch of portfolio
enhancements: the theme-curtain color source on the mode toggle, a mobile hamburger
drawer nav, clickable certificate links, and a reworked project card — project
kinds, optional action links (Swagger / hosted web / Play Store / App Store) with
graceful missing-prop handling, a "join testing" CTA for beta apps, and tech-stack
badges — plus adding Microsoft SQL to the languages list. The AI-assistant rework
is explicitly **not** part of this destination.

Done when every ticket is resolved: the big threads (mobile nav, project card) have
an agreed design/spec ready to implement, and the trivial threads (Microsoft SQL,
certificate links, tech-stack badges, theme-curtain color) are applied in place.

## Notes

- **Domain:** React 19 + Vite + Tailwind v4 SPA, `motion` for animation, `radix-ui`
  (unified package) available for overlays, `@icons-pack/react-simple-icons` +
  `lucide-react` for icons. Data lives in `src/portfolio-data.ts`; the icon map
  lives in `src/app.tsx` (`skillIcons`).
- **Execution override:** this map is planning-first, but the trivial, already-decided
  threads are **applied in place** as their tickets resolve — Microsoft SQL,
  certificate links, tech-stack badges, and the theme-curtain color tweak. The
  larger threads (mobile nav, project card layout) produce a design/spec to
  implement afterward, not finished code.
- **Skills to consult:** `/prototype` for the UI tickets, `/grilling` +
  `/domain-modeling` for the data-model tickets, `/motion` before touching any
  animation. Copy stays plain/direct (see auto-memory `copy-tone-plain`); styling
  follows `styling-conventions` (Tailwind utilities, rem over px, kebab-case files).
- Referenced code: `theme-curtain.tsx`, `terminal-frame.tsx` (Sidebar / TabBar /
  ModeSwitch), `assistant-console.tsx`, `project-card.tsx`, `portfolio-data.ts`,
  `app.tsx` (`skillIcons`, certifications render, `ProjectGrid`).

## Decisions so far

<!-- one line per closed ticket: gist of the answer + link -->

- [Theme curtain color source on mode toggle](issues/01-theme-curtain-color-source.md) —
  mode toggle now wipes with a **gradient current → target** (theme changes stay on
  target swatches); applied in place via an optional `toSwatches` on `ThemeCurtain`.

- [Mobile hamburger drawer navigation](issues/02-mobile-hamburger-nav.md) —
  **Variant A (left slide-in drawer)** on the official shadcn `Sheet`; below `wide`
  the tab strip is hidden and the `☰` (top-bar leading cell) takes over as primary
  nav. Drawer = profile + pages tree + socials; `ModeSwitch`/theme stay in the bar.
  A11y free via Radix Dialog. Spec ready to implement; prototype on branch
  `prototype/mobile-hamburger-nav`.

- [Add Microsoft SQL to languages](issues/03-add-microsoft-sql.md) — added tag
  **"Microsoft SQL"** to `skillGroups.languages`; no Simple Icons mark exists, so
  fell back to the `lucide-react` `Database` glyph in MSSQL brand red (`#CC2927`)
  in `skillIcons`. Applied in place.

- [Project data model](issues/05-project-data-model.md) — `ProjectItem` gains
  `kind` (backend/web/mobile, doesn't gate links), a `status` enum (`live`/`testing`,
  replacing `statusLabel`+`statusTone`, label+tone derived), an optional named-keys
  `links` object (github/swagger/web/playStore/appStore), and a required free-string
  `stack`. Testing is mobile-only and relabels the store links as the join-testing
  CTA. Unblocks the project card layout (ticket 06).

## Not yet specified

<!-- in-scope fog; graduates into tickets as the frontier advances -->

- **Populating real project data** once the project data model (ticket 05) lands:
  actual kinds, action URLs, beta targets, and tech stacks for each project entry.
  Likely user-provided content + a small task; can't be shaped until the model exists.
- **Icon coverage** for the new project action links (Swagger / Play Store / App
  Store) and Microsoft SQL — whether the current icon packs export suitable marks,
  and the fallback if not. Surfaces while working tickets 03 and 06.
- Whether the project preview well (currently a "project screenshot" placeholder)
  becomes a real image as part of the card rework, or stays a placeholder.

## Out of scope

<!-- ruled beyond this destination; never graduates -->

- **AI assistant real responses** — the `AssistantConsole` is fully simulated
  (canned, keyword-matched). Making it give real LLM-backed responses is
  infra-heavy (provider choice, serverless key-proxy, cost, grounding on portfolio
  data) and will be charted as its **own wayfinder** later, not resumed here.
