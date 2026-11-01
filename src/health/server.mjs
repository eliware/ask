import { createServer } from "node:http";

export function createHealthServer({
  host = "0.0.0.0",
  port = 3000,
  serverFactory = createServer,
} = {}) {
  let ready = false;
  const server = serverFactory((request, response) => {
    const path = request.url?.split("?", 1)[0];
    if (request.method !== "GET") {
      response.writeHead(405, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: "method not allowed" }));
      return;
    }
    if (path === "/health") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }
    if (path === "/ready") {
      const status = ready ? 200 : 503;
      response.writeHead(status, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: ready ? "ready" : "not ready" }));
      return;
    }
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ status: "not found" }));
  });

  return {
    start: () =>
      new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, host, () => {
          server.off("error", reject);
          resolve();
        });
      }),
    close: () =>
      new Promise((resolve, reject) => {
        if (!server.listening) {
          resolve();
          return;
        }
        server.close((error) => (error ? reject(error) : resolve()));
      }),
    setReady(value) {
      ready = Boolean(value);
    },
    address: () => server.address(),
  };
}
