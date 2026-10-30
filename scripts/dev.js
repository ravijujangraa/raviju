import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const children = [
  spawn(process.execPath, [path.join(root, "server.js")], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, API_ONLY: "1", PORT: process.env.API_PORT || "3001" },
  }),
  spawn(process.execPath, [path.join(root, "node_modules/vite/bin/vite.js")], {
    cwd: root,
    stdio: "inherit",
  }),
];

let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (child.exitCode === null) child.kill();
  setTimeout(() => process.exit(code), 100).unref();
}
for (const child of children) child.on("exit", (code) => {
  if (!stopping) stop(code || 0);
});
process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
