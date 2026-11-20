import extractContentOutputImages from "../../../src/response/images/content-output.mjs";

test("extracts base64 and URL images from ordinary output content", () => {
  expect(
    extractContentOutputImages({
      content: [{ b64_json: "aGVsbG8=" }, { url: "https://image.test/file.png" }],
    }),
  ).toEqual([
    expect.objectContaining({ filename: "image.png", buffer: Buffer.from("hello") }),
    expect.objectContaining({ url: "https://image.test/file.png" }),
  ]);
});

test("skips content that does not contain a valid image", () => {
  expect(extractContentOutputImages({ content: [{}, { url: "file:///image.png" }] })).toEqual([]);
});

test("returns no images when output has no content", () => {
  expect(extractContentOutputImages({})).toEqual([]);
});
