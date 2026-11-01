import { getFallbackText, normalizeOutputs } from "../../src/response/outputs.mjs";

test("normalizeOutputs handles arrays, objects, and missing values", () => {
  const array = [{ content: "a" }];
  expect(normalizeOutputs({ outputs: array })).toBe(array);
  expect(normalizeOutputs({ output: array })).toBe(array);
  expect(normalizeOutputs({ outputs: { a: 1, b: 2 } })).toEqual([1, 2]);
  expect(normalizeOutputs({ output: { a: 3, b: 4 } })).toEqual([3, 4]);
  expect(normalizeOutputs({ outputs: "no", output: null })).toEqual([]);
  expect(normalizeOutputs(null)).toEqual([]);
});

test("gets text from supported fallback values", () => {
  expect(getFallbackText("plain text")).toBe("plain text");
  expect(getFallbackText({ text: "text" })).toBe("text");
  expect(getFallbackText({ output_text: "output" })).toBe("output");
  expect(getFallbackText({ content: "content" })).toBe("content");
  expect(getFallbackText({ image: "not text" })).toBe("");
  expect(getFallbackText(null)).toBe("");
  expect(getFallbackText(3)).toBe("");
});
