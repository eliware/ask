import { addBlockquote, defaultSplit, splitBlockquoted } from "../../src/response/formatting.mjs";

test("formats blockquotes including null and blank lines", () => {
  expect(addBlockquote("a\n\nb")).toBe("> a\n> \n> b");
  expect(addBlockquote(null)).toBe("> ");
  expect(addBlockquote(undefined)).toBe("> ");
  expect(addBlockquote("  \n\tb")).toBe("> \n> \tb");
});
test("splits text at boundaries", () => {
  expect(defaultSplit("abcdef", 2)).toEqual(["ab", "cd", "ef"]);
  expect(defaultSplit("", 2)).toEqual([]);
  expect(defaultSplit("a", 5)).toEqual(["a"]);
});
test("keeps quoted chunks within their limit", () => {
  expect(splitBlockquoted("a".repeat(12), 7)).toEqual(["> aaaaa", "> aaaaa", "> aa"]);
  expect(splitBlockquoted("one\ntwo", 7)).toEqual(["> one", "> two"]);
  expect(splitBlockquoted("", 7)).toEqual(["> "]);
  expect(splitBlockquoted(null, 7)).toEqual(["> "]);
  expect(splitBlockquoted("a\nb", 8)).toEqual(["> a\n> b"]);
});
