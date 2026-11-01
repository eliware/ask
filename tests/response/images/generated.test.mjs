import { extractGeneratedImage } from "../../../src/response/images/generated.mjs";

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
