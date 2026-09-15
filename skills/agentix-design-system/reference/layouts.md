# Page layouts — Agentix / SpecOps

## Marketing shell (public pages)

- Sticky top bar: small logo mark + wordmark + `BETA` pill, primary nav
  links (`Platform`, `Pricing`, `Security`, `Docs`), right side `Live demo`
  ghost button + `Create account` primary button.
- Hero: two-column split. Left = eyebrow pill, large bold headline with one
  `.brand-gradient-text` highlighted phrase, supporting paragraph with
  inline `code`-styled tokens, a checklist of 4–6 feature bullets (emerald
  check chip + bold lead-in + muted continuation), two CTAs (primary
  gradient + secondary outline), then a stats strip (3–4 big bold numbers
  with muted captions) below a divider.
- Right = a live-looking product panel (signup form or console preview)
  inside a `panel-solid` card with its own internal sections (form, plan
  list, security posture note) — this panel should look like real product
  UI, not a generic illustration.

## Console shell

- CSS grid: fixed sidebar (280px) + flexible main column.
- Main column: sticky top bar, then scrollable content with consistent
  `p-6 md:p-8` padding.
- Standard content structure top→bottom:
  1. Breadcrumb (in top bar).
  2. Page header (title + subtitle + right-aligned actions).
  3. Stat card row (`grid grid-cols-2 lg:grid-cols-4 gap-4`).
  4. Two-column grid (`lg:grid-cols-[1fr_360px] gap-6`):
     - Left: the primary workflow/table/timeline card(s) stacked vertically
       with `gap-6`.
     - Right: supporting summary cards (budget, agents/config, security,
       secrets, invitations) stacked with `gap-6`.

## Page-specific notes

- **Dashboard**: active workflow stepper card + recent runs table on the
  left; budget donut, phase-agent list, secret vault list on the right.
- **Projects (list)**: filter tabs (`All / Connected / Simulated`) + search
  input, responsive card grid (3 columns) for projects, each project card =
  icon chip, name, repo slug, status badge, 3 mini metrics, thin progress
  bar with trigger label, two buttons (`Open` primary, `Agents` secondary).
  Below: a repository-mapping table.
- **Project detail**: header with icon, name, status badge, meta row
  (repo, branch, trigger label, member count, budget), tab bar (`Overview /
  Agents / Automation / Usage & cost`), then the same stat-row + two-column
  pattern as dashboard but scoped to the project.
- **Members & roles**: 4 role-count stat cards, members table with role
  `<select>`-style pill, projects/last-active/MFA columns, a role
  permissions matrix table (capabilities × roles with check/cross), and a
  pending invitations list card.
- **Usage & cost**: 4 stat cards, budget summary lines with inline progress
  bars, a large area/line chart card (spend per day), 3-column breakdown
  (`By phase` bars, `By model` donut, `By role` bars), a by-project table,
  an attribution sample table, an immutable metering ledger table, and a
  pricing table.
- **Billing & pricing**: current plan card (price, seats/projects/usage
  progress bars), payment method card, recent invoices list, and a full
  plan-comparison capability table.
- **Settings**: tenant profile form, budget guardrails form with an inline
  warning callout, audit log table; right rail = security posture list,
  retention settings, and a red-bordered danger zone card.

## Responsiveness

- Below `lg`, collapse the sidebar into a hamburger-triggered drawer, stack
  the two-column grid into a single column (main content first, then the
  right rail), and reduce stat grid to 2 columns / 1 column on small
  screens.
