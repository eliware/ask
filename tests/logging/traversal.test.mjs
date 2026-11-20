import sanitizeForLog from "../../src/logging/sanitize-for-log.mjs";

test("dispatches arrays to array traversal", () => {
  expect(sanitizeForLog([1, 2])).toEqual([1, 2]);
});

test("handles circular objects", () => {
  const circular = {};
  circular.self = circular;
  expect(sanitizeForLog(circular).self).toBe("<<circular>>");
});

test("preserves repeated references that are not cycles", () => {
  const shared = { value: "present" };
  expect(sanitizeForLog({ first: shared, second: shared })).toEqual({
    first: { value: "present" },
    second: { value: "present" },
  });
});
