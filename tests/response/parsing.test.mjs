import { parseResponse } from "../../src/response/parsing.mjs";

test("combines content text while collecting images", () => {
  expect(
    parseResponse({
      outputs: [
        {
          content: [{ text: "first" }, { url: "https://image.test/file.png" }, { text: "second" }],
        },
      ],
    }),
  ).toEqual({
    replyText: "first\nsecond",
    images: [expect.objectContaining({ url: "https://image.test/file.png" })],
  });
});

test("coordinates image extraction for generated images", () => {
  expect(
    parseResponse({
      output: [{ type: "image_generation_call", id: "ig_generated", result: "aGVsbG8=" }],
    }),
  ).toEqual({
    replyText: "",
    images: [
      expect.objectContaining({
        buffer: Buffer.from("hello"),
        filename: "image_ig_generated.png",
      }),
    ],
  });
});

test("coordinates image extraction from response content", () => {
  expect(parseResponse({ outputs: [{ content: [{ b64_json: "aGVsbG8=" }] }] })).toEqual({
    replyText: "",
    images: [expect.objectContaining({ buffer: Buffer.from("hello"), filename: "image.png" })],
  });
  expect(
    parseResponse({
      outputs: [
        { type: "image_generation_call", result: "invalid" },
        { content: [{ b64_json: "invalid", url: "https://ignored.test" }] },
      ],
    }),
  ).toEqual({ replyText: "", images: [] });
});

test("uses fallback text and ignores nontext fallback objects", () => {
  expect(parseResponse({ output_text: "fallback" })).toEqual({ replyText: "fallback", images: [] });
  expect(parseResponse({ text: "text fallback" })).toEqual({
    replyText: "text fallback",
    images: [],
  });
  expect(
    parseResponse({
      output_text: { image: "generated" },
      text: { image: "generated" },
      output: [{ type: "image_generation_call", id: "ig_image", result: "aGVsbG8=" }],
    }).replyText,
  ).toBe("");
  expect(parseResponse({})).toEqual({ replyText: "", images: [] });
});

test("extracts text fields from fallback objects", () => {
  expect(parseResponse({ output_text: { text: "caption" } })).toEqual({
    replyText: "caption",
    images: [],
  });
  expect(parseResponse({ output_text: { output_text: "output caption" } })).toEqual({
    replyText: "output caption",
    images: [],
  });
  expect(parseResponse({ text: { content: "content caption" } })).toEqual({
    replyText: "content caption",
    images: [],
  });
});
