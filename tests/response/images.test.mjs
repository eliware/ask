import { decodeBase64Image } from "../../src/response/images.mjs";

test("decodeBase64Image decodes and returns null on invalid input", () => {
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
