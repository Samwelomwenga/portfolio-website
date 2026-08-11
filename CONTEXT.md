# Portfolio Website

This context describes the portfolio-specific language used by the site and its planning artifacts.

## Language

**AI portfolio assistant**:
A real AI-powered assistant on the portfolio that answers visitor questions using Samwel's portfolio information as its source of truth.
_Avoid_: AI feature, fake assistant, canned assistant

**Primary visitor**:
A recruiter or hiring manager using the portfolio to assess Samwel's skills, project experience, role fit, and contact path.
_Avoid_: Generic visitor, everyone

**Portfolio-grounded answer**:
An assistant response based only on Samwel's portfolio source of truth, with uncertainty or refusal when the portfolio does not contain the answer.
_Avoid_: General AI answer, guessed answer, hallucinated answer

**Canonical portfolio source**:
The structured portfolio content that powers the visible site and grounds assistant answers.
_Avoid_: Separate assistant knowledge base, duplicated profile document

**Curated recruiter Q&A**:
Assistant guidance for common recruiter questions, supported by facts in the canonical portfolio source.
_Avoid_: Hidden biography, unsupported talking points

**Full portfolio context**:
A compact assistant prompt context built from the canonical portfolio source and sent with each assistant request.
_Avoid_: Per-question retrieval, hidden private context

**Measurable portfolio evidence**:
Specific numbers, outcomes, or concrete proof points in the canonical portfolio source that support strong impact claims.
_Avoid_: Unsupported impact claim, vague proof

**Source ID**:
A stable label for a section or item in the canonical portfolio source, included in assistant responses for grounding traceability even if the UI does not display it in v1.
_Avoid_: Untraceable answer
