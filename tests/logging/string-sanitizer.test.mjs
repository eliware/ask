import sanitizeLogString from "../../src/logging/string-sanitizer.mjs";

test("sanitizes long and nonprintable strings", () => {
  expect(sanitizeLogString("plain", 10)).toBe("plain");
  expect(sanitizeLogString("x".repeat(11), 10)).toContain("truncated");
  expect(sanitizeLogString("\u0000\u0000", 10)).toContain("nonprintable=2");
});
