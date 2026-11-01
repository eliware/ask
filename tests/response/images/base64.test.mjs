import { extractBase64ContentImage } from "../../../src/response/images/base64.mjs";

test("extracts base64 images from supported fields", () => {
  const cases = [
    { b64_json: "aGVsbG8=" },
    { base64: "aGVsbG8=" },
    { image: { b64: "aGVsbG8=" } },
    { image: { b64_json: "aGVsbG8=" } },
    { image: { base64: "aGVsbG8=" } },
  ];
  for (const value of cases) {
    expect(extractBase64ContentImage(value)).toEqual({
      handled: true,
      image: expect.objectContaining({ buffer: Buffer.from("hello"), filename: "image.png" }),
    });
  }
  expect(
    extractBase64ContentImage({
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
  expect(extractBase64ContentImage({ b64_json: "invalid" })).toEqual({
    handled: true,
    image: null,
  });
  expect(extractBase64ContentImage({ b64_json: "" })).toEqual({ handled: false, image: null });
  expect(extractBase64ContentImage({ b64_json: 2 })).toEqual({ handled: false, image: null });
});
