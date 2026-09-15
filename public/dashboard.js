"use strict";

/* Overview — Agentix console page.
   Live service health, endpoint probes, and workspace stats. */

const { api, timeAgo, formatUptime } = AgentixShell;

const els = {
  statStatus: document.getElementById("stat-status"),
  statStatusCaption: document.getElementById("stat-status-caption"),
  statUptime: document.getElementById("stat-uptime"),
  statNotes: document.getElementById("stat-notes"),
  statToday: document.getElementById("stat-today"),
  endpointRows: document.getElementById("endpoint-rows"),
  runChecks: document.getElementById("run-checks"),
  recentList: document.getElementById("recent-list"),
  recentEmpty: document.getElementById("recent-empty"),
  runtimeUptime: document.getElementById("runtime-uptime"),
  runtimeOrigin: document.getElementById("runtime-origin"),
  runtimeLatency: document.getElementById("runtime-latency"),
  runtimeChecked: document.getElementById("runtime-checked"),
  checksSummary: document.getElementById("checks-summary"),
};

const ENDPOINTS = [
  { key: "health", method: "GET", path: "/api/health", purpose: "Health + process uptime", synthetic: false },
  { key: "list", method: "GET", path: "/api/notes", purpose: "List notes, newest first", synthetic: false },
  { key: "create", method: "POST", path: "/api/notes", purpose: "Create a note", synthetic: true },
  { key: "delete", method: "DELETE", path: "/api/notes/:id", purpose: "Delete a note by id", synthetic: true },
];

const NOTE_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8"/></svg>';

function badge(kind, label, dot = false) {
  const span = document.createElement("span");
  span.className = `badge badge--${kind}`;
  if (dot) {
    const d = document.createElement("span");
    d.className = "badge-dot";
    span.append(d);
  }
  span.append(document.createTextNode(label));
  return span;
}

function renderEndpointTable() {
  els.endpointRows.replaceChildren();
  for (const endpoint of ENDPOINTS) {
    const tr = document.createElement("tr");
    tr.dataset.key = endpoint.key;

    const tdPath = document.createElement("td");
    const code = document.createElement("code");
    code.className = "mono";
    code.textContent = endpoint.path;
    tdPath.append(code);

    const tdMethod = document.createElement("td");
    tdMethod.append(badge("", endpoint.method));

    const tdPurpose = document.createElement("td");
    tdPurpose.textContent = endpoint.purpose;
    if (endpoint.synthetic) {
      const hint = document.createElement("span");
      hint.className = "text-muted";
      hint.textContent = " · synthetic transaction";
      tdPurpose.append(hint);
    }

    const tdLatency = document.createElement("td");
    tdLatency.className = "num";
    tdLatency.innerHTML = `<span class="mono" data-latency>—</span>`;

    const tdStatus = document.createElement("td");
    tdStatus.dataset.status = "";
    tdStatus.append(badge("", "Pending"));

    tr.append(tdPath, tdMethod, tdPurpose, tdLatency, tdStatus);
    els.endpointRows.append(tr);
  }
}

function setRowResult(key, { ok, latencyMs, label }) {
  const row = els.endpointRows.querySelector(`tr[data-key="${key}"]`);
  if (!row) return;
  row.querySelector("[data-latency]").textContent = `${latencyMs} ms`;
  const statusCell = row.querySelector("[data-status]");
  statusCell.replaceChildren(badge(ok ? "success" : "danger", label, true));
}

async function probeReadonly() {
  for (const endpoint of ENDPOINTS.filter((e) => !e.synthetic)) {
    const started = performance.now();
    try {
      await api(endpoint.path);
      setRowResult(endpoint.key, {
        ok: true,
        latencyMs: Math.round(performance.now() - started),
        label: "200 OK",
      });
    } catch {
      setRowResult(endpoint.key, {
        ok: false,
        latencyMs: Math.round(performance.now() - started),
        label: "Failed",
      });
    }
  }
}

async function probeSynthetic() {
  // Real round-trip: create a probe note, then delete it.
  const started = performance.now();
  try {
    const { note } = await api("/api/notes", {
      method: "POST",
      body: JSON.stringify({ text: "[probe] synthetic health-check transaction" }),
    });
    setRowResult("create", {
      ok: true,
      latencyMs: Math.round(performance.now() - started),
      label: `201 · N-${String(note.id).padStart(3, "0")}`,
    });

    const delStarted = performance.now();
    await api(`/api/notes/${note.id}`, { method: "DELETE" });
    setRowResult("delete", {
      ok: true,
      latencyMs: Math.round(performance.now() - delStarted),
      label: `200 · N-${String(note.id).padStart(3, "0")}`,
    });
  } catch {
    setRowResult("create", { ok: false, latencyMs: Math.round(performance.now() - started), label: "Failed" });
    setRowResult("delete", { ok: false, latencyMs: 0, label: "Skipped" });
  }
}

async function runAllChecks() {
  els.runChecks.disabled = true;
  els.runChecks.textContent = "Running…";
  renderEndpointTable();

  await probeReadonly();
  await probeSynthetic();

  const results = [...els.endpointRows.querySelectorAll("[data-status] .badge")];
  const passed = results.filter((b) => b.classList.contains("badge--success")).length;
  els.checksSummary.replaceChildren(
    badge(passed === ENDPOINTS.length ? "success" : "danger", `${passed}/${ENDPOINTS.length} endpoints passing`, true)
  );

  els.runChecks.disabled = false;
  els.runChecks.replaceChildren(document.createTextNode("Run checks again"));
  await refreshStats();
}

async function refreshStats() {
  const navCount = document.getElementById("nav-notes-count");
  try {
    const health = await api("/api/health");
    els.statStatus.textContent = "Operational";
    els.statStatus.className = "stat-value stat-value--text text-emerald";
    els.statStatusCaption.replaceChildren(badge("success", "GET /api/health · 200", true));
    els.statUptime.textContent = formatUptime(health.uptime);
    els.runtimeUptime.textContent = formatUptime(health.uptime);
    els.runtimeLatency.textContent =
      AgentixShell.health?.latencyMs != null ? `${AgentixShell.health.latencyMs} ms` : "—";
    els.runtimeChecked.textContent = new Date().toLocaleTimeString();
  } catch {
    els.statStatus.textContent = "Degraded";
    els.statStatus.className = "stat-value stat-value--text text-rose";
    els.statStatusCaption.replaceChildren(badge("danger", "health probe failed", true));
  }

  try {
    const { notes } = await api("/api/notes");
    const visible = notes.filter(
      (note) => !note.text.startsWith("[probe] synthetic health-check")
    );
    els.statNotes.textContent = String(visible.length);
    if (navCount) navCount.textContent = String(visible.length);
    els.statToday.textContent = String(
      visible.filter((note) => {
        const d = new Date(note.createdAt);
        const now = new Date();
        return (
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth() &&
          d.getDate() === now.getDate()
        );
      }).length
    );
    renderRecent(visible.slice(0, 5));
  } catch {
    els.statNotes.textContent = "—";
  }
}

function renderRecent(recent) {
  els.recentList.replaceChildren();
  els.recentEmpty.hidden = recent.length > 0;

  for (const note of recent) {
    const row = document.createElement("li");
    row.className = "feed-row";

    const chip = document.createElement("span");
    chip.className = "feed-chip feed-chip--brand";
    chip.innerHTML = NOTE_ICON;

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

    row.append(chip, body);
    els.recentList.append(row);
  }
}

els.runChecks.addEventListener("click", runAllChecks);

renderEndpointTable();
probeReadonly();
refreshStats();
