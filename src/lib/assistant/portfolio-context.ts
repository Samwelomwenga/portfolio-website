import type { EvidenceFields } from "@/portfolio-data"

import { recruiterQA } from "@/lib/assistant/recruiter-qa"
import {
  aboutParagraphs,
  blogs,
  certifications,
  contactCommands,

  experience,
  hero,
  profile,
  projects,
  skillGroups,
} from "@/portfolio-data"
import "server-only"

/** Renders one Source-ID-prefixed unit; blank body lines are dropped. */
function unit(id: string, lines: readonly (string | false | undefined)[]): string {
  const body = lines.filter((line): line is string => Boolean(line && line.trim())).join("\n")
  return `[${id}]\n${body}`
}

const NON_ALPHANUMERIC = /[^a-z0-9]+/g
const EDGE_DASHES = /^-+|-+$/g

/** Slugify a title into a stable, self-assigning Source ID suffix. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(NON_ALPHANUMERIC, "-")
    .replace(EDGE_DASHES, "")
}

/** Emit populated evidence fields as labeled lines; omit each when empty. */
function evidenceLines(item: EvidenceFields): string[] {
  const lines: string[] = []
  if (item.metrics?.length)
    lines.push(`Metrics: ${item.metrics.join("; ")}`)
  if (item.impactEvidence?.length)
    lines.push(`Impact evidence: ${item.impactEvidence.join("; ")}`)
  if (item.proofPoints?.length)
    lines.push(`Proof points: ${item.proofPoints.join("; ")}`)
  return lines
}

/**
 * Ordered section builders — the array order *is* the context order, and each
 * entry returns its units. Stable, low-volatility content first.
 */
const SECTION_BUILDERS: readonly (() => string[])[] = [
  () => [
    unit("profile", [
      `${profile.name} — ${profile.title}, based in ${profile.location}.`,
      `Links: GitHub ${profile.githubUrl}, LinkedIn ${profile.linkedinUrl}, X ${profile.xUrl}.`,
    ]),
  ],

  () => [unit("hero", [hero.about])],

  () => [
    unit(
      "contact",
      contactCommands.map(c => `${c.action}: ${c.href}`),
    ),
  ],

  () => aboutParagraphs.map((paragraph, i) => unit(`about-${i + 1}`, [paragraph])),

  () =>
    skillGroups.map(group => unit(`skills-${slugify(group.title)}`, [group.tags.join(", ")])),

  () =>
    experience.map(exp =>
      unit(`exp-${slugify(exp.company)}`, [
        `${exp.company} — ${exp.role} (${exp.period}).`,
        exp.description,
        exp.points?.length ? `Highlights:\n${exp.points.map(p => `- ${p}`).join("\n")}` : undefined,
        ...evidenceLines(exp),
      ]),
    ),

  () =>
    projects.map(project =>
      unit(`proj-${slugify(project.title)}`, [
        `${project.title} (${project.typeLabel}, ${project.status}).`,
        project.blurb,
        `Stack: ${project.stack.join(", ")}.`,
        project.links?.web && `Web: ${project.links.web}`,
        project.links?.github && `GitHub: ${project.links.github}`,
        ...evidenceLines(project),
      ]),
    ),

  () =>
    certifications.map(cert =>
      unit(`cert-${cert.sourceId ?? slugify(cert.name)}`, [
        cert.name,
        cert.href && `Verify: ${cert.href}`,
      ]),
    ),

  () =>
    blogs.map(blog =>
      unit(`blog-${slugify(blog.title)}`, [`(draft) ${blog.title} — ${blog.blurb}`]),
    ),

  () =>
    recruiterQA.map(qa => unit(`qa-${qa.slug}`, [`Q: ${qa.question}`, `A: ${qa.answer}`])),
]

/**
 * Builds the assistant's portfolio context block from the canonical structured
 * data in `portfolio-data.ts`.
 *
 * Contract (frozen by the prompt/eval contract, §A + §D):
 * - **Deterministic ordering.** The output is a pure function of static data —
 *   no dates, no randomness — so it is byte-identical across calls within a
 *   deploy. This stability is what lets it sit in the cache prefix ahead of the
 *   volatile conversation turns for Gemini implicit caching.
 * - **Source IDs.** Every emitted unit is prefixed with its stable Source ID so
 *   the model can cite exactly what it relied on. IDs are derived from titles
 *   (self-assigning for new entries) except certifications, which carry an
 *   explicit `sourceId` acronym.
 * - **Server-only.** Guarded by `server-only`; importing it from a client
 *   component fails the build. It carries the curated recruiter Q&A, which must
 *   never reach the browser bundle.
 *
 * `assistantResponses` is deliberately excluded — it is old simulation copy,
 * not canonical source content.
 */
export function buildPortfolioContext(): string {
  return `${SECTION_BUILDERS.flatMap(build => build()).join("\n\n")}\n`
}
