import selectFallbackText from "../../../src/response/output/fallback.mjs";

test("gets text from supported fallback values", () => {
  expect(selectFallbackText("", { output_text: "plain text" })).toBe("plain text");
  expect(selectFallbackText("", { output_text: { text: "text" } })).toBe("text");
  expect(selectFallbackText("", { output_text: { output_text: "output" } })).toBe("output");
  expect(selectFallbackText("", { output_text: { content: "content" } })).toBe("content");
  expect(selectFallbackText("", { output_text: { image: "not text" } })).toBe("");
  expect(selectFallbackText("", { output_text: null, text: null })).toBe("");
  expect(selectFallbackText("", { output_text: 3, text: 3 })).toBe("");
});

test("selects reply text before fallback fields", () => {
  expect(selectFallbackText("reply", { output_text: "output", text: "text" })).toBe("reply");
  expect(selectFallbackText("", { output_text: "output" })).toBe("output");
  expect(selectFallbackText("", { output_text: {}, text: { content: "caption" } })).toBe("caption");
  expect(selectFallbackText("", {})).toBe("");
});
