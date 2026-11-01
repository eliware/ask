import { sanitizeLogString, truncateLogField } from "../../src/logging/strings.mjs";

test("sanitizes long and nonprintable strings", () => {
  expect(sanitizeLogString("plain", 10)).toBe("plain");
  expect(sanitizeLogString("x".repeat(11), 10)).toContain("truncated");
  expect(sanitizeLogString("\u0000\u0000", 10)).toContain("nonprintable=2");
});

test("truncates object fields to the configured limit", () => {
  expect(truncateLogField("abcdefgh", 3)).toBe("abc...[truncated length=8]");
});
