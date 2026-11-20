import { expect, jest, test } from "@jest/globals";

test("delegates text splitting to the selected splitter", async () => {
  jest.resetModules();
  const splitter = jest.fn((text, max) => [text.slice(0, max)]);
  const selectMessageSplitter = jest.fn(async () => splitter);
  jest.unstable_mockModule("../../src/interaction/splitter.mjs", () => ({
    default: selectMessageSplitter,
  }));
  const { default: splitMessage } = await import("../../src/interaction/splitting.mjs");

  await expect(splitMessage("hello", 2)).resolves.toEqual(["he"]);
  expect(selectMessageSplitter).toHaveBeenCalled();
  expect(splitter).toHaveBeenCalledWith("hello", 2);
});
