import { collectResponseText } from "../../src/response/text.mjs";

test("collects text from response content", () => {
  expect(
    collectResponseText(
      [
        { content: ["first", { text: "second" }, { output_text: "third" }, { content: "fourth" }] },
        { data: { caption: { text: "fifth" } } },
      ],
      {},
    ),
  ).toBe("first\nsecond\nthird\nfourth\nfifth");
});

test("skips generated image output text and selects fallback text", () => {
  expect(
    collectResponseText(
      [{ type: "image_generation_call", id: "ig_1", result: "aGVsbG8=", content: ["ignore"] }],
      { output_text: "fallback" },
    ),
  ).toBe("fallback");
});

test("returns an empty value when response contents have no text", () => {
  expect(collectResponseText([{ content: [{ text: 1 }] }], {})).toBe("");
});
