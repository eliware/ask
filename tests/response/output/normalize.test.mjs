import normalizeOutputs from "../../../src/response/output/normalize.mjs";

test("normalizes arrays, objects, and missing values", () => {
  const array = [{ content: "a" }];
  expect(normalizeOutputs({ outputs: array })).toBe(array);
  expect(normalizeOutputs({ output: array })).toBe(array);
  expect(normalizeOutputs({ outputs: { a: 1, b: 2 } })).toEqual([1, 2]);
  expect(normalizeOutputs({ output: { a: 3, b: 4 } })).toEqual([3, 4]);
  expect(normalizeOutputs({ outputs: "no", output: null })).toEqual([]);
  expect(normalizeOutputs(null)).toEqual([]);
});
