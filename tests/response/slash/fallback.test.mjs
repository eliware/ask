import createSlashFallback from "../../../src/response/slash/fallback.mjs";

test("creates a fallback message when no files exist", () => {
  expect(createSlashFallback([])).toEqual({ content: "Sorry, I could not create a reply." });
});

test("keeps attachments without adding fallback text", () => {
  const files = [{ name: "image.png" }];
  expect(createSlashFallback(files)).toEqual({ files });
});
