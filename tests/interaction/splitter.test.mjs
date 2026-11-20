import { expect, jest, test } from "@jest/globals";

test("selects the Discord splitter when available", async () => {
  jest.resetModules();
  const splitMsg = jest.fn((text, max) => [text.slice(0, max)]);
  jest.unstable_mockModule("@eliware/discord", () => ({ splitMsg }));
  const { default: selectMessageSplitter } = await import("../../src/interaction/splitter.mjs");

  const splitter = await selectMessageSplitter();
  expect(splitter("hello", 2)).toEqual(["he"]);
  expect(splitMsg).toHaveBeenCalledWith("hello", 2);
});

test("selects the local splitter when Discord has no splitter", async () => {
  jest.resetModules();
  jest.unstable_mockModule("@eliware/discord", () => ({}));
  const { default: selectMessageSplitter } = await import("../../src/interaction/splitter.mjs");

  const splitter = await selectMessageSplitter();
  expect(splitter("y".repeat(2100), 2000)).toEqual(["y".repeat(2000), "y".repeat(100)]);
});

test("selects the local splitter when loading Discord fails", async () => {
  jest.resetModules();
  jest.unstable_mockModule("@eliware/discord", () => {
    throw new Error("module unavailable");
  });
  const { default: selectMessageSplitter } = await import("../../src/interaction/splitter.mjs");

  const splitter = await selectMessageSplitter();
  expect(splitter("hello", 2)).toEqual(["he", "ll", "o"]);
});
