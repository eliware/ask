import sanitizeForLog from "../../src/logging/sanitize-for-log.mjs";

test("dispatches arrays to array traversal", () => {
  expect(sanitizeForLog([1, 2])).toEqual([1, 2]);
});

test("handles circular objects", () => {
  const circular = {};
  circular.self = circular;
  expect(sanitizeForLog(circular).self).toBe("<<circular>>");
});

test("handles array item serialization errors", () => {
  const value = [];
  Object.defineProperty(value, 0, {
    enumerable: true,
    get: () => {
      throw new Error("index");
    },
  });
  value.length = 1;
  expect(sanitizeForLog(value)[0]).toMatch(/error serializing index 0/);
});
