import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep } from "node:path";

const root = resolve("out");
const basePath = "/terms-made-clear";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
};
const { extname } = await import("node:path");

await stat(root);
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url ?? "/", "http://localhost").pathname,
    );
    if (pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
      response.writeHead(404).end("Not found");
      return;
    }
    const relative = pathname.slice(basePath.length);
    const file = resolve(
      root,
      `.${relative || "/"}`,
      pathname.endsWith("/") || pathname === basePath ? "index.html" : "",
    );
    if (!file.startsWith(`${root}${sep}`)) {
      response.writeHead(400).end("Invalid path");
      return;
    }
    const content = await readFile(file);
    response.writeHead(200, {
      "Content-Type": types[extname(file)] ?? "application/octet-stream",
    });
    response.end(content);
  } catch (error) {
    if (error instanceof URIError) {
      response.writeHead(400).end("Invalid URL");
      return;
    }
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      response.writeHead(404, { "Content-Type": "text/html" });
      response.end(await readFile(resolve(root, "404.html")));
      return;
    }
    console.error("Static preview request failed:", error);
    response.writeHead(500).end("Static preview failed");
  }
});
server.listen(4173, "127.0.0.1", () => {
  console.log(`Preview: http://127.0.0.1:4173${basePath}/`);
});
