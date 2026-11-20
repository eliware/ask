import { expect, jest, test } from "@jest/globals";
import createShutdownManager from "../../src/app/shutdown.mjs";

test("shuts down the client and health server only once", async () => {
  const client = { shutdown: jest.fn() };
  const healthServer = { setReady: jest.fn(), close: jest.fn() };
  const manager = createShutdownManager({ log: { warn: jest.fn() }, healthServer });
  manager.setClient(client);

  await manager.shutdownHook();
  await manager.shutdownHook();

  expect(manager.isShuttingDown()).toBe(true);
  expect(client.shutdown).toHaveBeenCalledTimes(1);
  expect(healthServer.setReady).toHaveBeenCalledWith(false);
  expect(healthServer.close).toHaveBeenCalledTimes(1);
});

test("skips Discord cleanup when no client was created", async () => {
  const log = { warn: jest.fn() };
  const manager = createShutdownManager({ log });

  await manager.shutdownHook();

  expect(log.warn).not.toHaveBeenCalled();
});

test("logs client and health server shutdown failures", async () => {
  const log = { warn: jest.fn() };
  const client = { shutdown: jest.fn(async () => Promise.reject(new Error("client failed"))) };
  const healthServer = {
    setReady: jest.fn(),
    close: jest.fn(async () => Promise.reject(new Error("health failed"))),
  };
  const manager = createShutdownManager({ log, healthServer });
  manager.setClient(client);

  await manager.shutdownHook();

  expect(log.warn).toHaveBeenNthCalledWith(1, "Discord shutdown failed", {
    error: "client failed",
  });
  expect(log.warn).toHaveBeenNthCalledWith(2, "Health server shutdown failed", {
    error: "health failed",
  });
});

test("stringifies non-error health server failures", async () => {
  const log = { warn: jest.fn() };
  const healthServer = {
    setReady: jest.fn(),
    close: jest.fn(async () => Promise.reject({})),
  };
  const manager = createShutdownManager({ log, healthServer });

  await manager.shutdownHook();

  expect(log.warn).toHaveBeenCalledWith("Health server shutdown failed", {
    error: "[object Object]",
  });
});

test("stringifies non-error shutdown failures", async () => {
  const log = { warn: jest.fn() };
  const manager = createShutdownManager({ log });
  manager.setClient({ shutdown: jest.fn(async () => Promise.reject({})) });

  await manager.shutdownHook();

  expect(log.warn).toHaveBeenCalledWith("Discord shutdown failed", { error: "[object Object]" });
});
