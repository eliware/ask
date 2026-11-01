import { createServer } from "node:http";
import { createHealthServerLifecycle } from "./lifecycle.mjs";
import { createReadinessState } from "./readiness.mjs";
import { createHealthRequestHandler } from "./routes.mjs";

export function createHealthServer({
  host = "127.0.0.1",
  port = 3000,
  serverFactory = createServer,
} = {}) {
  const readiness = createReadinessState();
  const server = serverFactory(createHealthRequestHandler(readiness.isReady));
  const lifecycle = createHealthServerLifecycle(server, { host, port });

  return {
    ...lifecycle,
    setReady: readiness.setReady,
  };
}
