import { createServer } from "node:http";
import { createReadinessState } from "./readiness.mjs";
import { createHealthRequestHandler } from "./routes.mjs";

export function createHealthServer({
  host = "127.0.0.1",
  port = 3000,
  serverFactory = createServer,
} = {}) {
  const readiness = createReadinessState();
  const server = serverFactory(createHealthRequestHandler(readiness.isReady));

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
    setReady: readiness.setReady,
    address: () => server.address(),
  };
}
