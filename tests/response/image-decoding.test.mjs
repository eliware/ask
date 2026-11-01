import { decodeBase64Image } from "../../src/response/image-decoding.mjs";

test("decodes base64 images and returns null for invalid input", () => {
  expect(decodeBase64Image("aGVsbG8=")).toEqual(Buffer.from("hello"));
  expect(decodeBase64Image(Symbol("bad"))).toBeNull();
  expect(decodeBase64Image("bad")).toBeNull();
  const from = Buffer.from;
  Buffer.from = () => {
    throw new Error("bad buffer");
  };
  expect(decodeBase64Image("aGVsbG8=")).toBeNull();
  Buffer.from = from;
});
