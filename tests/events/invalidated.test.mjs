import { jest, expect, test } from "@jest/globals";
import handler from "../../src/events/invalidated.mjs";
import readyHandler from "../../src/events/clientReady.mjs";
import { createHealthServer } from "../../src/health/server.mjs";

test("logs invalidation when no health server is configured", async () => {
  const log = { debug: jest.fn(), info: jest.fn(), error: jest.fn(), warn: jest.fn() };
  await expect(handler({ log })).resolves.toBeUndefined();
  expect(log.debug).toHaveBeenCalledWith("invalidated");
});

test("clears readiness after invalidation and restores it after clientReady", async () => {
  const log = { debug: jest.fn(), info: jest.fn() };
  const healthServer = createHealthServer({ host: "127.0.0.1", port: 0 });
  const client = { user: { tag: "test#0001", setPresence: jest.fn() } };
  const originalFetch = globalThis.fetch;
  const fetchSpy = jest
    .spyOn(globalThis, "fetch")
    .mockImplementation((...args) => originalFetch(...args));
  await healthServer.start();
  const { port } = healthServer.address();

  try {
    await readyHandler({ log, healthServer }, client);
    expect((await fetch(`http://localhost:${port}/ready`)).status).toBe(200);

    await handler({ log, healthServer });
    expect((await fetch(`http://localhost:${port}/ready`)).status).toBe(503);

    await readyHandler({ log, healthServer }, client);
    expect((await fetch(`http://localhost:${port}/ready`)).status).toBe(200);
  } finally {
    fetchSpy.mockRestore();
    await healthServer.close();
  }
});
