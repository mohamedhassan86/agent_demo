"use strict";

/**
 * In-memory notes store.
 * Deliberately tiny and dependency-free so it is easy to reason about
 * (and easy to replace with a real database later).
 */
const notes = [];
let nextId = 1;

function list() {
  return [...notes].sort((a, b) => b.createdAt - a.createdAt);
}

function create(text) {
  if (typeof text !== "string" || text.trim() === "") {
    const error = new Error("Note text must be a non-empty string");
    error.statusCode = 400;
    throw error;
  }

  const note = {
    id: nextId++,
    text: text.trim(),
    createdAt: Date.now(),
  };
  notes.push(note);
  return note;
}

function remove(id) {
  const index = notes.findIndex((note) => note.id === Number(id));
  if (index === -1) {
    const error = new Error(`Note ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  const [removed] = notes.splice(index, 1);
  return removed;
}

module.exports = { list, create, remove };
