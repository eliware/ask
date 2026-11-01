import { extractContentImage } from "../../../src/response/images/content.mjs";

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
