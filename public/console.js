"use strict";

/* Shared Agentix console shell logic:
   sidebar drawer, API health pill, shared fetch helper. */

const AgentixShell = (() => {
  async function api(path, options = {}) {
    const response = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!response.ok) {
      const { error } = await response.json().catch(() => ({}));
      throw new Error(error || `Request failed (${response.status})`);
    }
    return response.json();
  }

  function formatUptime(seconds) {
    const s = Math.floor(seconds);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ${s % 60}s`;
    const h = Math.floor(m / 60);
    return `${h}h ${String(m % 60).padStart(2, "0")}m`;
  }

  function timeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    if (diff < 45_000) return "just now";
    const m = Math.floor(diff / 60_000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KiB`;
  }

  function initSidebar() {
    const toggle = document.getElementById("nav-toggle");
    const scrim = document.getElementById("scrim");
    if (!toggle || !scrim) return;
    const close = () => document.body.classList.remove("sidebar-open");
    toggle.addEventListener("click", () =>
      document.body.classList.toggle("sidebar-open")
    );
    scrim.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  let lastHealth = null;

  async function refreshHealth() {
    const pill = document.getElementById("api-pill");
    const pillText = document.getElementById("api-pill-text");
    try {
      const started = performance.now();
      const health = await api("/api/health");
      lastHealth = {
        ...health,
        latencyMs: Math.round(performance.now() - started),
        checkedAt: Date.now(),
      };
      if (pill && pillText) {
        pill.className = "badge badge--success";
        pillText.textContent = "API operational";
      }
    } catch {
      lastHealth = { status: "unreachable", checkedAt: Date.now() };
      if (pill && pillText) {
        pill.className = "badge badge--danger";
        pillText.textContent = "API unreachable";
      }
    }
    window.dispatchEvent(
      new CustomEvent("shell:health", { detail: lastHealth })
    );
    return lastHealth;
  }

  function initHealthPolling(intervalMs = 30_000) {
    refreshHealth();
    setInterval(refreshHealth, intervalMs);
  }

  return {
    api,
    formatUptime,
    timeAgo,
    formatBytes,
    initSidebar,
    initHealthPolling,
    refreshHealth,
    get health() {
      return lastHealth;
    },
  };
})();

AgentixShell.initSidebar();
AgentixShell.initHealthPolling();
