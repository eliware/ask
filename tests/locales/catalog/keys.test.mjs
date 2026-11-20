import hasLocaleKeyMismatch from "../../../src/locales/catalog/keys.mjs";

test("finds missing and extra locale keys", () => {
  expect(hasLocaleKeyMismatch({ greeting: "Hello" }, ["greeting"])).toBe(false);
  expect(hasLocaleKeyMismatch({}, ["greeting"])).toBe(true);
  expect(hasLocaleKeyMismatch({ extra: "Hello" }, ["greeting"])).toBe(true);
});
