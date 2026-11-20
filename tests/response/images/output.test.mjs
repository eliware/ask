import extractOutputImages from "../../../src/response/images/output.mjs";

test("extracts a generated image from an output", () => {
  expect(
    extractOutputImages({ type: "image_generation_call", id: "ig_call", result: "aGVsbG8=" }),
  ).toEqual([
    expect.objectContaining({ filename: "image_ig_call.png", buffer: Buffer.from("hello") }),
  ]);
});

test("does not fall back to content images for a handled generated output", () => {
  expect(
    extractOutputImages({
      type: "image_generation_call",
      result: "invalid",
      content: [{ url: "https://image.test/file.png" }],
    }),
  ).toEqual([]);
});

test("extracts images from ordinary output content", () => {
  expect(
    extractOutputImages({
      content: [{ b64_json: "aGVsbG8=" }, { url: "https://image.test/file.png" }],
    }),
  ).toEqual([
    expect.objectContaining({ filename: "image.png", buffer: Buffer.from("hello") }),
    expect.objectContaining({ url: "https://image.test/file.png" }),
  ]);
});
