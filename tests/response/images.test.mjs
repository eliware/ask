import { extractContentImage, extractGeneratedImage } from "../../src/response/images.mjs";

test("extracts generated images and skips invalid or unrelated outputs", () => {
  expect(
    extractGeneratedImage({
      type: "image_generation_call",
      id: "ig_call",
      result: "aGVsbG8=",
      revised_prompt: "prompt",
    }),
  ).toEqual({
    handled: true,
    image: {
      buffer: Buffer.from("hello"),
      filename: "image_ig_call.png",
      mime: "image/png",
      description: "prompt",
    },
  });
  expect(extractGeneratedImage({ id: "ig_no_type", result: "bad" })).toEqual({
    handled: true,
    image: null,
  });
  expect(extractGeneratedImage({ id: "ordinary", result: "aGVsbG8=" })).toEqual({
    handled: false,
    image: null,
  });
  expect(extractGeneratedImage({ type: "image_generation_call", result: 4 })).toEqual({
    handled: false,
    image: null,
  });
  expect(extractGeneratedImage(null)).toEqual({ handled: false, image: null });
  expect(
    extractGeneratedImage({ type: "image_generation_call", result: "aGVsbG8=" }).image,
  ).toMatchObject({ filename: expect.stringMatching(/^image_\d+\.png$/u), description: null });
});

test("extracts base64 images with metadata from each supported field", () => {
  const cases = [
    { b64_json: "aGVsbG8=" },
    { base64: "aGVsbG8=" },
    { image: { b64: "aGVsbG8=" } },
    { image: { b64_json: "aGVsbG8=" } },
    { image: { base64: "aGVsbG8=" } },
  ];
  for (const value of cases) {
    expect(extractContentImage(value)).toEqual({
      handled: true,
      image: expect.objectContaining({ buffer: Buffer.from("hello"), filename: "image.png" }),
    });
  }
  expect(
    extractContentImage({
      b64_json: "aGVsbG8=",
      filename: "custom.png",
      mime: "image/custom",
      description: "description",
    }).image,
  ).toEqual({
    buffer: Buffer.from("hello"),
    filename: "custom.png",
    mime: "image/custom",
    description: "description",
  });
  expect(extractContentImage({ b64_json: "invalid", url: "https://ignored.test" })).toEqual({
    handled: true,
    image: null,
  });
});

test("extracts image URLs and ignores content without images", () => {
  const cases = [
    { image: { url: "https://one.test" } },
    { url: "https://two.test" },
    { src: "https://three.test" },
    { href: "https://four.test", filename: "four.png", description: "four" },
  ];
  for (const value of cases) {
    expect(extractContentImage(value).image).toMatchObject({ url: expect.any(String) });
  }
  expect(extractContentImage({})).toEqual({ handled: false, image: null });
  expect(extractContentImage(null)).toEqual({ handled: false, image: null });
  expect(extractContentImage({ b64_json: 2, image: { url: "" } })).toEqual({
    handled: false,
    image: null,
  });
});
