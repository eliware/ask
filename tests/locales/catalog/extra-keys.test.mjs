import hasExtraLocaleKeys from "../../../src/locales/catalog/extra-keys.mjs";

test("detects extra locale keys", () => {
  expect(hasExtraLocaleKeys({ greeting: "Hello" }, ["greeting"])).toBe(false);
  expect(hasExtraLocaleKeys({ extra: "Hello" }, ["greeting"])).toBe(true);
});
