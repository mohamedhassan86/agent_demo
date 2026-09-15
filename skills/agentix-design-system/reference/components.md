# Component patterns — Agentix / SpecOps

Reusable primitives referenced here live in `src/components/ui/`. Build new
UI by composing these, not by inventing parallel patterns.

## Logo / brand mark

- Small in-app mark: rounded-xl (10–12px) tile, `brand-gradient` fill, a
  simple white glyph (ribbon "S"/"A") centered, size 32–40px. Paired with
  wordmark (`font-bold`) and a `BETA` outline pill when in console context.
- Large brand mark (marketing splash, favicon source): the illustrated
  ribbon "A" with the friendly robot face nested inside, violet→indigo
  gradient, on a `surface-950` background. Never stretch or recolor it.
  Canonical asset: `public/images/agentix-logo.png` (also used as the
  favicon and in the marketing footer credit).

## Buttons

- **Primary**: `brand-gradient` background, white text, `font-semibold`,
  `rounded-lg` (or `rounded-full` for pill CTAs on marketing pages only),
  `px-4 py-2.5`, subtle `shadow-violet-600/25`, icon optional on the left.
- **Secondary**: `bg-white/5` or transparent, `border border-white/10`,
  `text-slate-200`, same radius/padding as primary, no shadow.
- **Ghost/text**: no border/background, `text-slate-300` hover `text-white`.
- Icon buttons (topbar bell/help): `h-9 w-9 rounded-lg border
  border-white/10 bg-white/[0.03]` centered icon.

## Badges / status pills

`rounded-full px-2.5 py-1 text-xs font-semibold` with a matching
low-opacity background:

- Success: `bg-emerald-500/15 text-emerald-400`
- Warning: `bg-amber-500/15 text-amber-400`
- Danger: `bg-rose-500/15 text-rose-400`
- Neutral/info: `bg-white/10 text-slate-300`
- Live indicator: leading `h-1.5 w-1.5 rounded-full bg-emerald-400` dot
  before the label.

## Cards

- `panel` (translucent) or `panel-solid` (opaque `#0d0f18`) —
  `rounded-2xl border border-white/[0.06] p-5 md:p-6`.
- **StatCard**: label top-left (`text-sm text-slate-400`), small icon chip
  top-right (`h-9 w-9 rounded-lg bg-white/5`), big bold value
  (`text-3xl font-bold text-white`), optional caption/delta line below in
  `text-xs` with emerald/rose coloring for direction.
- **Section card**: icon chip + bold title + muted subtitle in the header
  row, optional action button/badge at the far right, content below.

## Sidebar navigation

- Fixed width column, `bg-surface-900`, right border `white/6%`.
- Top: workspace switcher (avatar tile with initials on gradient bg + org
  name + plan/meta line + chevron).
- Grouped nav sections with uppercase micro-label headers: `WORKSPACE`,
  `PLATFORM`, `MANAGE`.
- Nav item: `flex items-center gap-3 rounded-lg px-3 py-2 text-sm`; inactive
  `text-slate-400 hover:bg-white/5 hover:text-white`; active
  `bg-white/[0.06] text-white` with an icon in `brand-400` and an optional
  trailing count pill (`bg-white/10 text-slate-300 rounded-md px-1.5`).
- Bottom: small reassurance callout card (icon + 2-line copy) above a user
  row (avatar, name, role, `···` menu).

## Top bar

- `flex items-center justify-between` row, breadcrumb on the left
  (`Org > Section`, `>` as a muted chevron, current crumb white/bold),
  search pill (`rounded-lg border border-white/10 bg-white/[0.03]` with a
  `⌘K` kbd hint on the right), a status pill (`● All systems operational`,
  emerald dot), then icon buttons (bell with red dot, help).

## Tables

- Header row: `text-[11px] uppercase tracking-wide text-slate-500`, no
  vertical borders, bottom border `white/6%`.
- Body rows: `divide-y divide-white/[0.05]`, hover `bg-white/[0.02]`,
  numeric/monospace columns right-aligned where relevant, status column
  uses `Badge`.

## Progress / budget

- Track: `h-1.5 rounded-full bg-white/10`.
- Fill: `brand-gradient` (or emerald/amber approaching cap), width = %.
- Paired with a label row: left = context text, right = current/limit in
  `font-mono` or tabular numerals.
- Radial/ring variant (budget donut) uses the same gradient stroke over a
  `white/10` track, big bold percentage centered, caption below.

## Workflow stepper

- Horizontal row of circular nodes (`h-9 w-9 rounded-full`) connected by a
  1–2px line (`bg-white/10`, completed segments `bg-emerald-500/60`).
- States: **done** = emerald filled circle with check icon; **active** =
  violet ring with spinning/pulsing icon, `brand-400` border glow;
  **pending** = outline `border-white/15 text-slate-500`.
- Label + timing/cost caption centered below each node.

## Timeline / activity feed

- Vertical list, each row: small icon chip on the left (colored by event
  type), bold one-line title, muted secondary line with monospace details
  (file paths, commit hashes), timestamp/metric right-aligned in muted text.

## Forms (auth / settings)

- Label: `text-sm text-slate-300 mb-1.5`.
- Input: `rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5
  text-sm text-white placeholder:text-slate-500 focus:border-violet-400/60
  focus:ring-2 focus:ring-violet-500/20`.
- Helper/security note under sensitive forms: small icon + `text-xs
  text-slate-500` sentence citing the concrete security mechanism.

## Pricing / plan comparison tables

- Row-based capability list, left column label, one column per plan,
  center-aligned check (`emerald`) / cross (`slate-600`) icons or plain
  values (numbers, "Full", "Custom").
- Current plan column optionally highlighted with a subtle `brand-500/10`
  column background and a `Current` badge in the header cell.
