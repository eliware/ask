import sanitizeForLog from "../../src/logging/sanitize-for-log.mjs";

test("dispatches arrays to array traversal", () => {
  expect(sanitizeForLog([1, 2])).toEqual([1, 2]);
});

test("handles circular objects", () => {
  const circular = {};
  circular.self = circular;
  expect(sanitizeForLog(circular).self).toBe("<<circular>>");
});
