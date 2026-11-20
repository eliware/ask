import sanitizeForLog from "../../src/logging/sanitize-for-log.mjs";

test("accepts null options", () => {
  expect(sanitizeForLog("ok", new WeakSet(), 0, null)).toBe("ok");
});

test("applies the default redaction options", () => {
  expect(sanitizeForLog({ image: "secret" }).image).toMatch(/redacted/u);
});
