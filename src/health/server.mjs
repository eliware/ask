import { createServer } from "node:http";
import { createHealthRequestHandler } from "./routes.mjs";

export function createHealthServer({
  host = "127.0.0.1",
  port = 3000,
  serverFactory = createServer,
} = {}) {
  let ready = false;
  const server = serverFactory(createHealthRequestHandler(() => ready));

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
