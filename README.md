# agent_demo

A minimal, zero-dependency Node.js demo app wired up with [GitHub Spec Kit](https://github.com/github/spec-kit)
for spec-driven development.

## Quick start

```bash
npm start          # http://localhost:3003 (override with PORT / HOST)
npm run dev        # same, with --watch restart on file changes
```

No `npm install` step — the app uses only Node built-ins (Node 18+).

### API

| Method   | Endpoint         | Description                        |
| -------- | ---------------- | ---------------------------------- |
| `GET`    | `/api/health`    | Health check + process uptime      |
| `GET`    | `/api/notes`     | List notes (newest first)          |
| `POST`   | `/api/notes`     | Create a note — body `{ "text": "…" }` |
| `DELETE` | `/api/notes/:id` | Delete a note by id                |

Notes live in memory (`src/notes.js`), so they reset on restart.

### Layout

```
public/            static frontend (index.html, styles.css, app.js)
src/server.js      HTTP server: static files + JSON API
src/notes.js       in-memory notes store
```

### Console pages

The frontend is an Agentix-branded dark console (see **Design system** below):

| Route          | Page                                                                 |
| -------------- | -------------------------------------------------------------------- |
| `/`            | **Notes** — capture form, stat cards, note stream, storage budget    |
| `/dashboard`   | **Overview** — endpoint health probes, runtime telemetry, activity   |

### UI agent

`.github/agents/ui.agent.md` defines **ui**, a frontend-focused Copilot
custom agent. Any task that creates pages, restyles components, or reviews
visual changes can be delegated to it (e.g. `@ui build the settings page`).
It is hard-wired to the design-system skill below and to this repo's
zero-dependency stack.

### Design system

`skills/agentix-design-system/` packages the Agentix / SpecOps visual
identity (dark navy surfaces, violet→indigo accent, reserved status
colors, card-based layouts) as rules plus token/component/layout reference
files. `public/styles.css` implements those tokens as plain CSS custom
properties — no build step, no frameworks.

## GitHub Spec Kit

Spec Kit is initialized in this repo for the **GitHub Copilot** integration.
It adds `.specify/` (templates, scripts, memory, workflow) and the Copilot
skills in `.github/skills/`.

### Slash commands

Open Copilot Chat **from this repo root** and type `/` — you'll see:

| Command                  | Purpose                                                  |
| ------------------------ | -------------------------------------------------------- |
| `/speckit-constitution`  | Establish the project's non-negotiable principles        |
| `/speckit-specify`       | Write the spec: what and why (no implementation detail)  |
| `/speckit-clarify`       | _(optional)_ Ask structured questions to de-risk ambiguity |
| `/speckit-plan`          | Technical plan: stack, architecture, data model          |
| `/speckit-tasks`         | Dependency-ordered task list                             |
| `/speckit-analyze`       | _(optional)_ Cross-artifact consistency report           |
| `/speckit-checklist`     | _(optional)_ Quality checklists for the requirements     |
| `/speckit-implement`     | Execute the tasks and write the code                     |
| `/speckit-taskstoissues` | Push generated tasks to GitHub issues                    |
| `/speckit-converge`      | Assess the codebase and append remaining work as tasks   |

Recommended first run: `/speckit-constitution` → `/speckit-specify` →
`/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.

The bundled constitution at `.specify/memory/constitution.md` still contains
placeholder sections — fill it in before your first `/speckit-specify`.

### Reinstalling or upgrading the CLI

The `specify` CLI is a developer-machine tool and is not vendored into the repo.
Project assets are bundled in the CLI, so the repo files match the CLI version
noted in `.specify/integration.json` (currently **1.0.6**).

```bash
# with uv (recommended)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify init --here --integration copilot --force

# or without uv
python3 -m venv .venv && .venv/bin/pip install "git+https://github.com/github/spec-kit.git@v1.0.6"
```

Add another agent later without disturbing the existing setup, e.g.
`specify init --here --integration claude --force`.
