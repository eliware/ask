import truncateLogField from "../../src/logging/field-truncation.mjs";
import sanitizeLogValue from "../../src/logging/sanitizer.mjs";

const options = { maxDepth: 2, maxString: 20, maxArray: 5, maxEntries: 10, redactPatterns: [] };

test("normalizes primitive values and enforces the depth limit", () => {
  expect(sanitizeLogValue("text", new WeakSet(), 0, options, truncateLogField)).toBe("text");
  expect(sanitizeLogValue(4, new WeakSet(), 0, options, truncateLogField)).toBe(4);
  expect(
    sanitizeLogValue({ deep: { value: 1 } }, new WeakSet(), 3, options, truncateLogField),
  ).toBe("<<max-depth>>");
});

test("recursively sanitizes object and array values", () => {
  expect(
    sanitizeLogValue({ values: [1, "two"] }, new WeakSet(), 0, options, truncateLogField),
  ).toEqual({ values: [1, "two"] });
});
