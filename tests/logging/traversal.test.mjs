import sanitizeForLog from "../../src/logging/sanitize-for-log.mjs";

test("limits and detects circular arrays", () => {
  const circular = [];
  circular.push(circular);
  expect(sanitizeForLog(circular)[0]).toBe("<<circular>>");
  expect(sanitizeForLog([1, 2, 3], new WeakSet(), 0, { maxArray: 2 })).toEqual([
    1,
    2,
    "<<1 more items...>>",
  ]);
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
