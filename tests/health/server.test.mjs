import { expect, jest, test } from "@jest/globals";
import { createHealthServer } from "../../src/health/server.mjs";

async function withLocalFetch(callback) {
  const originalFetch = globalThis.fetch;
  const fetchSpy = jest
    .spyOn(globalThis, "fetch")
    .mockImplementation((...args) => originalFetch(...args));
  try {
    await callback();
  } finally {
    fetchSpy.mockRestore();
  }
}

test("serves health and stays unavailable until readiness is set", async () => {
  const health = createHealthServer({ host: "127.0.0.1", port: 0 });
  await health.start();
  const { port } = health.address();
  try {
    await withLocalFetch(async () => {
      const healthResponse = await fetch(`http://localhost:${port}/health`);
      expect(healthResponse.status).toBe(200);
      await expect(healthResponse.json()).resolves.toEqual({ status: "ok" });

      const pendingResponse = await fetch(`http://localhost:${port}/ready`);
      expect(pendingResponse.status).toBe(503);
      await expect(pendingResponse.json()).resolves.toEqual({ status: "not ready" });

      health.setReady(true);
      const readyResponse = await fetch(`http://localhost:${port}/ready`);
      expect(readyResponse.status).toBe(200);
      await expect(readyResponse.json()).resolves.toEqual({ status: "ready" });

      health.setReady(false);
      const stoppedResponse = await fetch(`http://localhost:${port}/ready`);
      expect(stoppedResponse.status).toBe(503);
    });
  } finally {
    await health.close();
  }
});

test("returns 404 for unknown paths and 405 for other methods", async () => {
  const health = createHealthServer({ host: "127.0.0.1", port: 0 });
  await health.start();
  const { port } = health.address();
  try {
    await withLocalFetch(async () => {
      expect((await fetch(`http://localhost:${port}/unknown`)).status).toBe(404);
      expect((await fetch(`http://localhost:${port}/health`, { method: "POST" })).status).toBe(405);
    });
  } finally {
    await health.close();
  }
});

test("creates the default server without starting it", async () => {
  const health = createHealthServer();

  await health.close();

  expect(health.address()).toBeNull();
});
