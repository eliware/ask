import isGeneratedImageOutput from "../../../../src/response/images/image-generation/predicate.mjs";

test("identifies generated image outputs", () => {
  expect(isGeneratedImageOutput({ type: "image_generation_call", result: "data" })).toBe(true);
  expect(isGeneratedImageOutput({ id: "ig_call", result: "data" })).toBe(true);
  expect(isGeneratedImageOutput({ type: "image_generation_call", result: 1 })).toBe(false);
  expect(isGeneratedImageOutput({ id: "ordinary", result: "data" })).toBe(false);
  expect(isGeneratedImageOutput(null)).toBe(false);
});
