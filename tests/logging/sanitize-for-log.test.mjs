import sanitizeForLog from "../../src/logging/sanitize-for-log.mjs";

test("handles primitives and depth limits", () => {
  expect(sanitizeForLog(null)).toBeNull();
  expect(sanitizeForLog(undefined)).toBeUndefined();
  expect(sanitizeForLog(3)).toBe(3);
  expect(sanitizeForLog(false)).toBe(false);
  expect(sanitizeForLog({ deep: { value: 1 } }, new WeakSet(), 6)).toBe("<<max-depth>>");
  expect(sanitizeForLog(() => {})).toBe("() => {}");
});
test("sanitizes strings and binary values", () => {
  expect(sanitizeForLog(Buffer.from("x"))).toBe("[Buffer length=1]");
  expect(sanitizeForLog("plain")).toBe("plain");
  expect(sanitizeForLog("\u0000".repeat(2))).toMatch(/nonprintable/);
  expect(sanitizeForLog("x".repeat(20), new WeakSet(), 0, { maxString: 10 })).toMatch(/truncated/);
});
test("accepts null options", () => {
  expect(sanitizeForLog("ok", new WeakSet(), 0, null)).toBe("ok");
});
