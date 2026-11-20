import { jest, expect, test } from "@jest/globals";
import clientReadyHandler from "../../src/events/clientReady.mjs";
import handler from "../../src/events/invalidated.mjs";

test("logs invalidation when no health server is configured", async () => {
  const log = { debug: jest.fn(), info: jest.fn(), error: jest.fn(), warn: jest.fn() };
  await expect(handler({ log })).resolves.toBeUndefined();
  expect(log.debug).toHaveBeenCalledWith("invalidated");
});

test("clears and restores readiness after invalidation", async () => {
  const healthServer = { setReady: jest.fn() };
  const log = { debug: jest.fn(), info: jest.fn() };
  const client = { user: { tag: "test#0001", setPresence: jest.fn() } };

  await clientReadyHandler({ log, healthServer }, client);
  await handler({ log, healthServer });
  await clientReadyHandler({ log, healthServer }, client);

  expect(healthServer.setReady.mock.calls).toEqual([[true], [false], [true]]);
});
