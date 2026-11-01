import { prepareResponsePayload } from "../../src/response/payload.mjs";

test("prepares text, file, and URL payload data", () => {
  const buffer = Buffer.from("image");
  expect(
    prepareResponsePayload(" answer ", [
      { buffer, filename: "image.png" },
      { url: "https://example.test/image.png" },
      {},
    ]),
  ).toEqual({
    text: "answer",
    files: [{ attachment: buffer, name: "image.png" }],
    urls: ["https://example.test/image.png"],
  });
});

test("ignores unsupported text and empty image metadata", () => {
  expect(prepareResponsePayload({ text: "not plain text" }, [{}])).toEqual({
    text: "",
    files: [],
    urls: [],
  });
});
