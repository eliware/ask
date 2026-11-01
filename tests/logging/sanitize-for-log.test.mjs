import sanitizeForLog from "../../src/logging/sanitize-for-log.mjs";

test("handles primitives and depth limits", () => {
  expect(sanitizeForLog({ deep: { value: 1 } }, new WeakSet(), 6)).toBe("<<max-depth>>");
});
test("accepts null options", () => {
  expect(sanitizeForLog("ok", new WeakSet(), 0, null)).toBe("ok");
});
