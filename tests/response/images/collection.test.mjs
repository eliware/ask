import { collectResponseImages } from "../../../src/response/images/collection.mjs";

test("collects generated, base64, and URL images from outputs", () => {
  expect(
    collectResponseImages([
      { type: "image_generation_call", id: "ig_generated", result: "aGVsbG8=" },
      { content: [{ b64_json: "aGVsbG8=" }, { url: "https://image.test/file.png" }] },
    ]),
  ).toEqual([
    expect.objectContaining({ filename: "image_ig_generated.png", buffer: Buffer.from("hello") }),
    expect.objectContaining({ filename: "image.png", buffer: Buffer.from("hello") }),
    expect.objectContaining({ url: "https://image.test/file.png" }),
  ]);
});

test("ignores invalid and unrelated image output", () => {
  expect(
    collectResponseImages([
      { type: "image_generation_call", result: "invalid" },
      { content: [{ b64_json: "invalid" }, { text: "no image" }] },
    ]),
  ).toEqual([]);
});
