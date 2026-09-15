---
name: agentix-design-system
description: Use whenever building, editing, or reviewing UI for the Agentix / SpecOps product family — marketing pages, sign-up/console screens, dashboards, settings, billing, tables, or any dark-themed SaaS surface that must match the official Agentix brand. Trigger this skill for requests like "build the Agentix landing page", "add a new SpecOps console screen", "make this match our design system", or any UI work inside this codebase. Read this file first, then load the reference files under reference/ only as needed for the task at hand.
license: Proprietary - internal use only
---

# Agentix Design System Skill

This skill packages the **Agentix / SpecOps** visual identity into rules an
agent must follow when generating or modifying UI. Agentix is the parent
brand ("Automate · Develop · Deploy · Evolve"); **SpecOps** is the flagship
console product built on the same design language. Every screen — marketing
or console — must look like it belongs to the same family.

Treat the rules below as **hard constraints**, not suggestions. If a request
conflicts with a rule (e.g. "make it light mode" or "use a red primary
button"), follow the request but flag the deviation explicitly — never
silently drift from the system on unrelated work.

## 1. When to use this skill

- Any new page/component in this repo (or a repo using this brand).
- Refactors or bug fixes that touch visual markup.
- Reviewing a PR/diff for design-system compliance.

Load `reference/tokens.md` when you need exact colors/spacing/typography
values. Load `reference/components.md` when building a specific component
(sidebar, stat card, badge, table, stepper, pricing table, etc). Load
`reference/layouts.md` when assembling a full page/screen.

## 2. Non-negotiable brand rules

1. **Dark mode only.** No light theme, no theme toggle. Base background is a
   near-black tinted navy (`#05060a`–`#0a0b12`), never pure `#000000` and
   never neutral gray.
2. **One accent family.** The only primary accent is the **violet → indigo**
   gradient (`#9b8afb → #6d4de0`). It is used for: primary buttons, active
   nav states, focus rings, key links, progress fill, and the logo mark.
   Do not introduce a second "brand" hue.
3. **Status colors are reserved.** Emerald = success/live/delivered/on.
   Amber = warning/rotating/needs-attention. Rose/red = error/failed/danger.
   Cyan = informational/streaming/active-process. Never use these for
   generic decoration — only for real state.
4. **Everything lives on cards.** Content sits inside `panel`/`panel-solid`
   surfaces: `rounded-2xl`, 1px `white/6%` border, subtle raised background
   (`#0d0f18`–`#10121c`), 20–24px padding. Flat, unbordered content floating
   on the page background is not allowed outside of hero/marketing copy.
5. **Data density over whitespace.** This is a builder/ops console: stat
   rows, tables, timelines, and metering ledgers are dense, aligned to a
   consistent grid, and use small (12–14px) text with generous internal
   line-height rather than large empty margins.
6. **Monospace is reserved for machine values**: file paths
   (`specs/NNN-feature/*.md`), slugs, labels (`sdlc`), commit hashes, keys
   (`sk-ant-••••7XQ`), IDs (`R-184`). Never use monospace for prose or
   headings.
7. **Icons are thin line icons** (1.5–2px stroke, ~18–20px), never filled
   glyphs or emoji inside product UI (emoji-free except the Agentix robot
   mark itself, which is an illustration, not emoji).
8. **Badges/pills are always `rounded-full`**, colored at low opacity
   (10–15%) with a matching solid-color label, e.g.
   `bg-emerald-500/15 text-emerald-400`. Cards and inputs are never fully
   round — only `rounded-xl`/`rounded-2xl`.
9. **Spacing grid is 4px-based**, most gaps land on 8/12/16/20/24px. Keep
   sidebar width fixed (≈280px desktop), top bar height fixed (≈64–72px).
10. **Typography:** `Inter` for all UI text, tight tracking on large
    headings, uppercase + letter-spacing on micro-labels/section eyebrows
    (nav group headers, table headers, stat card captions).

## 3. Voice & content rules

- Product copy is precise, technical, and confident — no hype adjectives.
  Prefer concrete facts ("AES-256-GCM", "92.1% judge pass rate") over vague
  claims.
- Section eyebrows are short, uppercase, dot-separated
  (`SPEC KIT WORKFLOW · GITHUB-NATIVE`).
- Security/compliance facts are always visible near trust-sensitive actions
  (sign-up forms, billing, secret vaults) — never hide them in a footer.
- Numbers are real-looking and specific, never round marketing numbers
  ("4.1M metered LLM calls/month", not "millions of calls").

## 4. Do / Don't quick reference

**Do**
- Reuse the shared primitives in `src/components/ui/*` (Badge, Card,
  StatCard, ProgressBar, Button, Table, WorkflowStepper) instead of hand
  rolling new markup.
- Keep the left sidebar + top bar shell (`ConsoleLayout`) for every
  authenticated/console screen.
- Use the gradient only once per view as the loudest element (usually the
  primary CTA or the logo).
- Show budgets/usage as a ring or bar with a numeric label plus context
  ("64.2% used · $2,000 org budget").

**Don't**
- Don't use pure white cards, drop-shadowed neumorphism, or light gradients.
- Don't mix multiple bright accent colors on the same primary action.
- Don't left-align badges without an icon or dot when representing status.
- Don't invent a new sidebar/topbar pattern per page — the shell is fixed.
- Don't use serif fonts, script fonts, or condensed fonts anywhere.

## 5. Implementation checklist for any new screen

1. Wrap in `ConsoleLayout` (sidebar + topbar + breadcrumb) unless it's a
   public marketing page (`MarketingShell`).
2. Start with a page header: bold white `text-2xl`/`text-3xl` title + one
   muted sentence of context, optional primary/secondary buttons at right.
3. Add a stat-card row (3–4 `StatCard`s) if the page reports metrics.
4. Split remaining content into a ~65/35 two-column grid on large screens:
   main workflow/table/timeline on the left, budget/agents/security/vault
   summary cards stacked on the right.
5. Use `Badge` for every status word, `ProgressBar` for every capacity
   metric, monospace `<code>`-style spans for every machine value.
6. Confirm nothing renders on a light background and the only saturated
   gradient is the primary CTA / active nav item / logo.
