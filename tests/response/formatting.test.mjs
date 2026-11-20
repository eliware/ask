import addBlockquote from "../../src/response/formatting.mjs";

test("formats blockquotes including null and blank lines", () => {
  expect(addBlockquote("a\n\nb")).toBe("> a\n> \n> b");
  expect(addBlockquote(null)).toBe("> ");
  expect(addBlockquote(undefined)).toBe("> ");
  expect(addBlockquote("  \n\tb")).toBe("> \n> \tb");
});
