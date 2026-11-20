import findMissingLocales from "../../../src/locales/catalog/missing.mjs";

test("lists supported locales that have no catalog file", () => {
  expect(findMissingLocales(["en-US", "fr"], ["en-US", "fr", "de"])).toEqual(["missing de"]);
  expect(findMissingLocales(["en-US", "fr"], ["en-US", "fr"])).toEqual([]);
});
