import traverseLogArray from "../../src/logging/arrays.mjs";

test("limits array values and detects circular arrays", () => {
  const circular = [];
  circular.push(circular);
  const sanitize = (value, seen) => (seen.has(value) ? "<<circular>>" : value);
  expect(traverseLogArray(circular, sanitize, new WeakSet(), 0, 5)).toEqual(["<<circular>>"]);
  const seen = new WeakSet([circular]);
  expect(traverseLogArray(circular, sanitize, seen, 0, 5)).toBe("<<circular>>");
  expect(traverseLogArray([], sanitize, new WeakSet(), 0, 5)).toEqual([]);
  expect(traverseLogArray([1, 2, 3], (value) => value, new WeakSet(), 0, 2)).toEqual([
    1,
    2,
    "<<1 more items...>>",
  ]);
});

test("records array item serialization errors", () => {
  const value = [];
  Object.defineProperty(value, 0, {
    enumerable: true,
    get: () => {
      throw new Error("index");
    },
  });
  value.length = 1;
  expect(traverseLogArray(value, (item) => item, new WeakSet(), 0, 5)[0]).toMatch(
    /error serializing index 0/,
  );
});
