"use strict";

/* Notes workspace — Agentix console page.
   Talks to /api/notes; shared shell helpers come from console.js. */

const { api, timeAgo, formatBytes } = AgentixShell;

const STORAGE_BUDGET_BYTES = 64 * 1024; // workspace budget for the in-memory store

const els = {
  form: document.getElementById("note-form"),
  input: document.getElementById("note-input"),
  list: document.getElementById("note-list"),
  emptyState: document.getElementById("empty-state"),
  search: document.getElementById("search"),
  countBadge: document.getElementById("notes-count-badge"),
  navCount: document.getElementById("nav-notes-count"),
  statTotal: document.getElementById("stat-total"),
  statToday: document.getElementById("stat-today"),
  statStorage: document.getElementById("stat-storage"),
  statActivity: document.getElementById("stat-activity"),
  storageFill: document.getElementById("storage-fill"),
  storageUsed: document.getElementById("storage-used"),
  storagePct: document.getElementById("storage-pct"),
  apiStatus: document.getElementById("api-status"),
  apiUptime: document.getElementById("api-uptime"),
  apiLatency: document.getElementById("api-latency"),
  apiChecked: document.getElementById("api-checked"),
  activityFeed: document.getElementById("activity-feed"),
  newNoteBtn: document.getElementById("new-note-btn"),
  refreshBtn: document.getElementById("refresh-btn"),
};

const encoder = new TextEncoder();
let notes = [];
let query = "";
let lastLocalEventAt = null;
const sessionEvents = [];

const ICONS = {
  created:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  deleted:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8"/></svg>',
  sync: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.65 4.36A9 9 0 0 0 20.5 15"/></svg>',
};

function usedBytes() {
  return notes.reduce((sum, note) => sum + encoder.encode(note.text).length, 0);
}

function isToday(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function logSessionEvent(type, detail) {
  sessionEvents.unshift({ type, detail, at: Date.now() });
  sessionEvents.length = Math.min(sessionEvents.length, 8);
  lastLocalEventAt = Date.now();
  renderActivity();
}

function renderNotes() {
  const filtered = query
    ? notes.filter((note) =>
        note.text.toLowerCase().includes(query.toLowerCase())
      )
    : notes;

  els.list.replaceChildren();
  els.emptyState.hidden = filtered.length > 0;

  if (filtered.length === 0) {
    const title = els.emptyState.querySelector(".empty-title");
    const body = els.emptyState.querySelector(".empty-body");
    if (query) {
      title.textContent = "No matches";
      body.textContent = `Nothing in the store matches “${query}”.`;
    } else {
      title.textContent = "No notes yet";
      body.textContent = "Capture your first note above — it lands in the in-memory store instantly.";
    }
  }

  for (const note of filtered) {
    const row = document.createElement("li");
    row.className = "feed-row";

    const chip = document.createElement("span");
    chip.className = "feed-chip feed-chip--brand";
    chip.innerHTML = ICONS.note;

    const body = document.createElement("div");
    body.className = "feed-body";

    const title = document.createElement("p");
    title.className = "feed-title";
    title.textContent = note.text;

    const meta = document.createElement("p");
    meta.className = "feed-meta";
    const id = document.createElement("code");
    id.className = "mono";
    id.textContent = `N-${String(note.id).padStart(3, "0")}`;
    meta.append(id, document.createTextNode(`captured ${timeAgo(note.createdAt)}`));

    body.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "row-actions";

    const saved = document.createElement("span");
    saved.className = "badge badge--success";
    const dot = document.createElement("span");
    dot.className = "badge-dot";
    saved.append(dot, document.createTextNode("Saved"));

    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn-icon btn-icon--danger";
    del.setAttribute("aria-label", `Delete note N-${String(note.id).padStart(3, "0")}`);
    del.innerHTML = ICONS.deleted;
    del.addEventListener("click", async () => {
      await api(`/api/notes/${note.id}`, { method: "DELETE" });
      logSessionEvent("deleted", `N-${String(note.id).padStart(3, "0")} removed from store`);
      await refreshNotes();
    });

    actions.append(saved, del);
    row.append(chip, body, actions);
    els.list.append(row);
  }
}

function renderStats() {
  els.statTotal.textContent = String(notes.length);
  els.statToday.textContent = String(notes.filter((n) => isToday(n.createdAt)).length);
  els.statStorage.textContent = formatBytes(usedBytes());

  const latest = notes[0]?.createdAt ?? lastLocalEventAt;
  els.statActivity.textContent = latest ? timeAgo(latest) : "—";

  els.countBadge.textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
  els.navCount.textContent = String(notes.length);

  const used = usedBytes();
  const pct = Math.min(100, (used / STORAGE_BUDGET_BYTES) * 100);
  els.storageFill.style.width = `${pct}%`;
  els.storageFill.className =
    pct > 90 ? "progress-fill progress-fill--danger"
    : pct > 70 ? "progress-fill progress-fill--warning"
    : "progress-fill";
  els.storageUsed.textContent = `${pct.toFixed(2)}% used · ${formatBytes(used)} of 64 KiB workspace budget`;
  els.storagePct.textContent = formatBytes(used);
}

function renderActivity() {
  els.activityFeed.replaceChildren();

  const items = [
    ...sessionEvents.map((event) => ({
      type: event.type,
      title:
        event.type === "created" ? "Note captured" :
        event.type === "deleted" ? "Note deleted" : "Store synced",
      detail: event.detail,
      at: event.at,
    })),
    ...notes.map((note) => ({
      type: "created",
      title: "Note captured",
      detail: `N-${String(note.id).padStart(3, "0")} · ${note.text.slice(0, 48)}${note.text.length > 48 ? "…" : ""}`,
      at: note.createdAt,
    })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 6);

  if (items.length === 0) {
    const li = document.createElement("li");
    li.className = "feed-row";
    const text = document.createElement("p");
    text.className = "feed-meta";
    text.textContent = "No activity yet this session.";
    li.append(text);
    els.activityFeed.append(li);
    return;
  }

  for (const item of items) {
    const row = document.createElement("li");
    row.className = "feed-row";

    const chip = document.createElement("span");
    chip.className =
      item.type === "created" ? "feed-chip feed-chip--emerald"
      : item.type === "deleted" ? "feed-chip feed-chip--rose"
      : "feed-chip feed-chip--cyan";
    chip.innerHTML = ICONS[item.type] ?? ICONS.sync;

    const body = document.createElement("div");
    body.className = "feed-body";
    const title = document.createElement("p");
    title.className = "feed-title";
    title.textContent = item.title;
    const meta = document.createElement("p");
    meta.className = "feed-meta";
    meta.textContent = `${item.detail} · ${timeAgo(item.at)}`;
    body.append(title, meta);

    row.append(chip, body);
    els.activityFeed.append(row);
  }
}

async function refreshNotes() {
  const { notes: data } = await api("/api/notes");
  notes = data;
  renderNotes();
  renderStats();
}

function renderHealthPanel(detail) {
  if (!detail) return;
  const ok = detail.status === "ok";
  els.apiStatus.className = `badge ${ok ? "badge--success" : "badge--danger"}`;
  els.apiStatus.replaceChildren(
    document.createTextNode(ok ? "operational" : "unreachable")
  );
  if (ok) {
    const dot = document.createElement("span");
    dot.className = "badge-dot";
    els.apiStatus.prepend(dot);
  }
  els.apiUptime.textContent = ok ? AgentixShell.formatUptime(detail.uptime) : "—";
  els.apiLatency.textContent = detail.latencyMs != null ? `${detail.latencyMs} ms` : "—";
  els.apiChecked.textContent = new Date(detail.checkedAt).toLocaleTimeString();
}

/* ---- wiring ---- */

els.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = els.input.value.trim();
  if (!text) return;

  const { note } = await api("/api/notes", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  els.input.value = "";
  els.input.focus();
  logSessionEvent("created", `N-${String(note.id).padStart(3, "0")} appended to store`);
  await refreshNotes();
});

els.search.addEventListener("input", () => {
  query = els.search.value.trim();
  renderNotes();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
    event.preventDefault();
    els.search.focus();
  }
});

els.newNoteBtn.addEventListener("click", () => {
  els.input.focus();
  els.input.scrollIntoView({ behavior: "smooth", block: "center" });
});

els.refreshBtn.addEventListener("click", async () => {
  await refreshNotes();
  AgentixShell.refreshHealth();
});

window.addEventListener("shell:health", (event) => renderHealthPanel(event.detail));

refreshNotes().then(() => logSessionEvent("sync", `${notes.length} notes loaded from store`));

setInterval(() => {
  renderStats();
  renderActivity();
  renderNotes();
}, 30_000);
