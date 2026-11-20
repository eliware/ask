import truncateLogField from "../../src/logging/field-truncation.mjs";

test("truncates object fields to the configured limit", () => {
  expect(truncateLogField("abcdefgh", 3)).toBe("abc...[truncated length=8]");
});
