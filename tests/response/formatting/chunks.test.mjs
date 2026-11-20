import splitBlockquoted from "../../../src/response/formatting/chunks.mjs";

test("keeps quoted chunks within their limit", () => {
  expect(splitBlockquoted("a".repeat(12), 7)).toEqual(["> aaaaa", "> aaaaa", "> aa"]);
  expect(splitBlockquoted("one\ntwo", 7)).toEqual(["> one", "> two"]);
  expect(splitBlockquoted("", 7)).toEqual(["> "]);
  expect(splitBlockquoted(null, 7)).toEqual(["> "]);
  expect(splitBlockquoted("a\nb", 8)).toEqual(["> a\n> b"]);
});
