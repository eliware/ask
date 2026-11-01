import { parseResponse } from "../../src/response/parsing.mjs";

test("parses text from supported output and content shapes", () => {
  const result = parseResponse({
    outputs: [
      {
        content: [
          "plain",
          { text: "text" },
          { output_text: "output" },
          { content: "content" },
          { text: 1 },
        ],
      },
      { content: { one: { text: "object" } } },
      { content: "string" },
      { data: [{ text: "data-array" }] },
      { data: { one: { text: "data-object" } } },
      "output-string",
      { content: null },
      null,
    ],
  });

  expect(result).toEqual({
    replyText:
      "plain\ntext\noutput\ncontent\nobject\nstring\ndata-array\ndata-object\noutput-string",
    images: [],
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
