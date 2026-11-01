import { expect, test } from "@jest/globals";
import { createReadinessState } from "../../src/health/readiness.mjs";

test("tracks readiness as a boolean", () => {
  const readiness = createReadinessState();

  expect(readiness.isReady()).toBe(false);
  readiness.setReady("ready");
  expect(readiness.isReady()).toBe(true);
  readiness.setReady(0);
  expect(readiness.isReady()).toBe(false);
});
