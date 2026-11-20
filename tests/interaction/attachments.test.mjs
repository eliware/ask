import attachFilesToFirstChunk from "../../src/interaction/attachments.mjs";

test("attaches files only to the first chunk", () => {
  expect(attachFilesToFirstChunk(["first", "second"], ["image"])).toEqual([
    { content: "first", files: ["image"] },
    "second",
  ]);
});

test("keeps chunks unchanged when no files exist", () => {
  const chunks = ["first", "second"];
  expect(attachFilesToFirstChunk(chunks, null)).toBe(chunks);
});

test("creates a file-only payload when text produces no chunks", () => {
  expect(attachFilesToFirstChunk([], ["image"])).toEqual([{ files: ["image"] }]);
});
