import { jest, expect, test } from "@jest/globals";
import handler from "../../src/events/invalidated.mjs";
import readyHandler from "../../src/events/clientReady.mjs";

test("logs invalidation when no health server is configured", async () => {
  const log = { debug: jest.fn(), info: jest.fn(), error: jest.fn(), warn: jest.fn() };
  await expect(handler({ log })).resolves.toBeUndefined();
  expect(log.debug).toHaveBeenCalledWith("invalidated");
});

test("clears readiness after invalidation and restores it after clientReady", async () => {
  const log = { debug: jest.fn(), info: jest.fn() };
  const healthServer = { setReady: jest.fn() };
  const client = { user: { tag: "test#0001", setPresence: jest.fn() } };

  await readyHandler({ log, healthServer }, client);
  await handler({ log, healthServer });
  await readyHandler({ log, healthServer }, client);

  expect(healthServer.setReady.mock.calls).toEqual([[true], [false], [true]]);
});
