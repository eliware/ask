import { jest, expect, test } from "@jest/globals";
import handler from "../../src/events/invalidated.mjs";

test("logs invalidation when no health server is configured", async () => {
  const log = { debug: jest.fn(), info: jest.fn(), error: jest.fn(), warn: jest.fn() };
  await expect(handler({ log })).resolves.toBeUndefined();
  expect(log.debug).toHaveBeenCalledWith("invalidated");
});
