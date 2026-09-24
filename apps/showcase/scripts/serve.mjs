import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const output = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
const port = Number(process.env.PORT ?? 4173);
const mediaTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".ttf": "font/ttf",
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
    const filename = resolve(output, `.${pathname === "/" ? "/index.html" : pathname}`);
    if (!filename.startsWith(`${output}${sep}`) || !(await stat(filename)).isFile()) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "content-type": mediaTypes[extname(filename)] ?? "application/octet-stream" });
    response.end(await readFile(filename));
  } catch {
    response.writeHead(404).end();
  }
}).listen(port, "127.0.0.1", () => {
  process.stdout.write(`Cairn showcase: http://127.0.0.1:${port}\n`);
});
