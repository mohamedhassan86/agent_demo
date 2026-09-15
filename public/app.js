const form = document.getElementById("note-form");
const input = document.getElementById("note-input");
const list = document.getElementById("note-list");
const emptyState = document.getElementById("empty-state");

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

function render(notes) {
  list.replaceChildren();
  emptyState.hidden = notes.length > 0;

  for (const note of notes) {
    const item = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = note.text;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "delete";
    button.textContent = "Delete";
    button.addEventListener("click", async () => {
      await api(`/api/notes/${note.id}`, { method: "DELETE" });
      await refresh();
    });

    item.append(text, button);
    list.append(item);
  }
}

async function refresh() {
  const { notes } = await api("/api/notes");
  render(notes);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  await api("/api/notes", { method: "POST", body: JSON.stringify({ text }) });
  input.value = "";
  input.focus();
  await refresh();
});

refresh();
