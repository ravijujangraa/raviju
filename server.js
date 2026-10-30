import "dotenv/config";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const root = path.dirname(fileURLToPath(import.meta.url));
const apiOnly = process.env.API_ONLY === "1";
const port = Number(process.env.PORT || (apiOnly ? 3001 : 4173));
const maxBody = 16 * 1024;
const windowMs = 10 * 60 * 1000;
const requestLimit = 5;
const requestsByIp = new Map();

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
};

function json(res, status, value) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(value));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > maxBody) {
        reject(Object.assign(new Error("Request is too large."), { status: 413 }));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(Object.assign(new Error("Please send a valid form."), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function isValidEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function limitFor(ip) {
  const now = Date.now();
  const current = requestsByIp.get(ip);
  if (!current || now - current.start >= windowMs) {
    requestsByIp.set(ip, { start: now, count: 1 });
    return true;
  }
  if (current.count >= requestLimit) return false;
  current.count += 1;
  return true;
}

async function sendContact(req, res) {
  let payload;
  try {
    payload = await readJson(req);
  } catch (error) {
    return json(res, error.status || 400, { error: error.message || "Invalid request." });
  }

  const name = typeof payload?.name === "string" ? payload.name.trim() : "";
  const email = typeof payload?.email === "string" ? payload.email.trim() : "";
  const message = typeof payload?.message === "string" ? payload.message.trim() : "";
  const website = typeof payload?.website === "string" ? payload.website.trim() : "";

  // Quietly accept honeypot submissions without delivering them.
  if (website) return json(res, 200, { ok: true });
  if (!name || name.length > 100 || /[\r\n]/.test(name)) {
    return json(res, 400, { error: "Please enter a valid name (up to 100 characters)." });
  }
  if (!isValidEmail(email)) return json(res, 400, { error: "Please enter a valid email address." });
  if (!message || message.length > 2000) {
    return json(res, 400, { error: "Please enter a message (up to 2,000 characters)." });
  }

  const ip = req.socket.remoteAddress || "unknown";
  if (!limitFor(ip)) {
    return json(res, 429, { error: "Too many messages from this connection. Please try again in 10 minutes." });
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const to = process.env.CONTACT_TO || "ravijujangraa@gmail.com";
  if (!user || !pass) {
    console.error("Contact mail is not configured: set SMTP_USER and SMTP_PASSWORD in .env.");
    return json(res, 503, { error: "The contact form is not connected yet. Please try again later." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || user,
      to,
      replyTo: { name, address: email },
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    return json(res, 200, { ok: true });
  } catch (error) {
    console.error("Contact message delivery failed:", error?.code || error?.message || "Unknown SMTP error");
    return json(res, 502, { error: "Message delivery failed. Please try again later." });
  }
}

async function serveStatic(req, res, pathname) {
  const dist = path.join(root, "dist");
  let filePath = path.resolve(dist, `.${decodeURIComponent(pathname)}`);
  if (!filePath.startsWith(`${dist}${path.sep}`) && filePath !== path.join(dist, "index.html")) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, "index.html");
    const content = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mime[path.extname(filePath)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    });
    res.end(content);
  } catch {
    if (path.extname(pathname)) {
      res.writeHead(404).end("Not found");
      return;
    }
    const index = await readFile(path.join(dist, "index.html"));
    res.writeHead(200, { "Content-Type": mime[".html"] });
    res.end(index);
  }
}

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  if (req.method === "POST" && pathname === "/api/contact") return sendContact(req, res);
  if (req.method === "GET" && pathname === "/api/health") {
    return json(res, 200, { ok: true, mailConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD) });
  }
  if (apiOnly) return json(res, 404, { error: "Not found." });
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD, POST" }).end();
    return;
  }
  return serveStatic(req, res, pathname);
});

server.listen(port, "0.0.0.0", () => {
  console.log(apiOnly ? `Contact API listening on http://localhost:${port}` : `Portfolio server listening on http://localhost:${port}`);
});

function close() {
  server.close(() => process.exit(0));
}
process.on("SIGINT", close);
process.on("SIGTERM", close);
