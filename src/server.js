"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const notesStore = require("./notes");

const PORT = Number(process.env.PORT) || 3003;
const HOST = process.env.HOST || "0.0.0.0";
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const PAGE_ALIASES = {
  "/dashboard": "/dashboard.html",
};

function serveStatic(req, res, pathname) {
  pathname = PAGE_ALIASES[pathname] || pathname;
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.join(PUBLIC_DIR, relativePath);

  // Prevent path traversal outside of the public directory.
  if (!filePath.startsWith(PUBLIC_DIR + path.sep)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
}

async function handleApi(req, res, pathname) {
  if (pathname === "/api/health") {
    sendJson(res, 200, { status: "ok", uptime: process.uptime() });
    return;
  }

  if (pathname === "/api/notes") {
    if (req.method === "GET") {
      sendJson(res, 200, { notes: notesStore.list() });
      return;
    }
    if (req.method === "POST") {
      const raw = await readRequestBody(req);
      let parsed = {};
      try {
        parsed = raw ? JSON.parse(raw) : {};
      } catch {
        sendJson(res, 400, { error: "Request body must be valid JSON" });
        return;
      }
      try {
        sendJson(res, 201, { note: notesStore.create(parsed.text) });
      } catch (error) {
        sendJson(res, error.statusCode || 400, { error: error.message });
      }
      return;
    }
  }

  const noteMatch = pathname.match(/^\/api\/notes\/(\d+)$/);
  if (noteMatch && req.method === "DELETE") {
    try {
      sendJson(res, 200, { note: notesStore.remove(noteMatch[1]) });
    } catch (error) {
      sendJson(res, error.statusCode || 400, { error: error.message });
    }
    return;
  }

  sendJson(res, 404, { error: "Unknown endpoint" });
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (pathname.startsWith("/api/")) {
    handleApi(req, res, pathname).catch((error) => {
      sendJson(res, 500, { error: error.message });
    });
    return;
  }

  serveStatic(req, res, pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`agent-demo listening on http://${HOST}:${PORT}`);
});
