import { extractContentImage } from "../../../src/response/images/content.mjs";

test("coordinates base64 and URL image extraction", () => {
  expect(extractContentImage({ b64_json: "aGVsbG8=" })).toEqual({
    handled: true,
    image: expect.objectContaining({ buffer: Buffer.from("hello"), filename: "image.png" }),
  });
  expect(extractContentImage({ url: "https://example.test/image.png" })).toEqual({
    handled: true,
    image: expect.objectContaining({ url: "https://example.test/image.png" }),
  });
  expect(extractContentImage({ b64_json: "invalid", url: "https://ignored.test" })).toEqual({
    handled: true,
    image: null,
  });
  expect(extractContentImage({})).toEqual({ handled: false, image: null });
});
