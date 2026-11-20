import createSlashChunks from "../../../src/response/slash/chunks.mjs";

test("creates chunks for blockquoted text and URLs", () => {
  const chunks = createSlashChunks("a".repeat(2500), ["https://images.example.test/a"]);
  expect(chunks.length).toBeGreaterThan(2);
  expect(chunks.every((chunk) => chunk.length <= 2000)).toBe(true);
  expect(chunks.join("\n")).toContain("https://images.example.test/a");
});

test("creates URL chunks when text is empty", () => {
  expect(createSlashChunks("", ["https://images.example.test/a"])).toEqual([
    "https://images.example.test/a",
  ]);
});

test("returns no chunks when text and URLs are empty", () => {
  expect(createSlashChunks("", [])).toEqual([]);
});
