import { expect, jest, test } from "@jest/globals";

test("uses the Discord splitter when available", async () => {
  jest.resetModules();
  const splitMsg = jest.fn((text, max) => [text.slice(0, max)]);
  jest.unstable_mockModule("@eliware/discord", () => ({ splitMsg }));
  const { splitMessage } = await import("../../src/interaction/splitting.mjs");

  await expect(splitMessage("hello", 2)).resolves.toEqual(["he"]);
  expect(splitMsg).toHaveBeenCalledWith("hello", 2);
});

test("uses the local splitter when the Discord splitter is unavailable", async () => {
  jest.resetModules();
  jest.unstable_mockModule("@eliware/discord", () => ({}));
  const { splitMessage } = await import("../../src/interaction/splitting.mjs");

  await expect(splitMessage("y".repeat(2100), 2000)).resolves.toEqual([
    "y".repeat(2000),
    "y".repeat(100),
  ]);
});

test("uses the local splitter when loading the Discord splitter fails", async () => {
  jest.resetModules();
  jest.unstable_mockModule("@eliware/discord", () => {
    throw new Error("module unavailable");
  });
  const { splitMessage } = await import("../../src/interaction/splitting.mjs");

  await expect(splitMessage("hello", 2)).resolves.toEqual(["he", "ll", "o"]);
});
