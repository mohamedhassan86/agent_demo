# Design tokens — Agentix / SpecOps

These map 1:1 to the Tailwind v4 `@theme` block in `src/index.css`. Always
reuse these tokens instead of arbitrary hex values.

## Color

| Token | Hex | Usage |
|---|---|---|
| `surface-950` | `#05060a` | App/body background |
| `surface-900` | `#0a0b12` | Page background variant, sidebar bg |
| `surface-850` | `#0d0f18` | Card/panel solid background |
| `surface-800` | `#10121c` | Elevated card, input background |
| `surface-750` | `#141724` | Nested panel / hovered row |
| `surface-700` | `#1a1e2c` | Table header row bg (rare) |
| `surface-600` | `#232838` | Borders on hover / dividers (bright variant) |
| border default | `white / 6%` | Card and input borders (`border-white/[0.06]`) |
| border strong | `white / 10%` | Hovered/focused borders |
| `brand-300` | `#b3a6fb` | Gradient text light stop, hover accents |
| `brand-400` | `#9b8afb` | Gradient start (buttons, logo) |
| `brand-500` | `#8266f5` | Solid accent, active nav icon |
| `brand-600` | `#6d4de0` | Gradient end (buttons, logo), pressed state |
| `brand-700` | `#5638c4` | Deepest accent / gradient shadow tint |
| `accent-cyan` | `#22d3ee` | Info / streaming / highlighted word in headline |
| `accent-emerald` | `#34d399` | Success / live / delivered / connected |
| `accent-amber` | `#f5b93f` | Warning / rotating / needs attention |
| `accent-rose` | `#f87171` | Error / destructive / danger zone |
| text primary | `#f5f6fa` (white/slate-50) | Headings, values |
| text secondary | `slate-300` (`#cbd2e0`) | Body copy |
| text muted | `slate-500` (`#6b7280`–`#7c869c`) | Captions, table headers, timestamps |

## Gradients

- **Brand button/logo gradient:** `linear-gradient(135deg, #9b8afb 0%, #7c6ff0 45%, #5b7cf5 100%)`
  (utility class `.brand-gradient`).
- **Brand text gradient** (for highlighted headline words such as
  "inside your repository"): `linear-gradient(135deg, #b7acfb 0%, #8ea6ff 60%, #7fe3f4 100%)`
  clipped to text (utility class `.brand-gradient-text`).
- **Chart fill:** violet at 25% opacity fading to transparent, stroke
  `brand-400`.

## Typography

- Font family: `Inter` (`--font-sans`). Monospace: `JetBrains Mono` / `Fira
  Code` (`--font-mono`).
- Display / hero headline: `text-4xl` to `text-6xl`, `font-bold`,
  `tracking-tight`, `leading-[1.05]`.
- Page title (console): `text-2xl`/`text-3xl`, `font-bold`, white.
- Card/section title: `text-base`/`text-lg`, `font-semibold`, white, often
  paired with a small icon in a rounded chip to its left.
- Body copy: `text-sm`, `text-slate-300/400`, `leading-relaxed`.
- Eyebrow / micro-label: `text-[11px]`–`text-xs`, `font-semibold`,
  `uppercase`, `tracking-widest`, `text-slate-500`.
- Table header: `text-[11px]`, `uppercase`, `tracking-wide`, `text-slate-500`.
- Numeric stat value: `text-2xl`–`text-4xl`, `font-bold`, tabular numerals.

## Radius, border, elevation

- Cards / panels: `rounded-2xl` (16px).
- Inputs / buttons / small cards: `rounded-lg`/`rounded-xl` (8–12px).
- Badges / pills / avatars: `rounded-full`.
- Border: always `1px solid white/6%` by default, `white/10%` on
  hover/focus, never a fully opaque gray border.
- Shadow: only on the primary gradient button/logo —
  `shadow-lg shadow-violet-600/25`. Cards use no shadow, only the subtle
  border + slightly lighter fill than the page background.

## Spacing & layout constants

- Base spacing unit: 4px; common gaps 8 / 12 / 16 / 20 / 24 / 32px.
- Sidebar width: `280px` (desktop), collapses to icon rail or drawer on
  mobile.
- Top bar height: `64–72px`.
- Page content max width inside console: fluid with `24–32px` outer
  padding; marketing pages cap at `~1280px` centered.
- Two-column console layout: main column ~`65%` / right rail ~`35%`
  (`grid-cols-1 lg:grid-cols-[1fr_360px]` pattern), gap `24px`.
