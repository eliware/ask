import hasInvalidLocaleValues from "../../../src/locales/catalog/values.mjs";

test("detects empty and non-string locale values", () => {
  expect(hasInvalidLocaleValues({ greeting: "Hello" })).toBe(false);
  expect(hasInvalidLocaleValues({ greeting: "" })).toBe(true);
  expect(hasInvalidLocaleValues({ greeting: "   " })).toBe(true);
  expect(hasInvalidLocaleValues({ greeting: null })).toBe(true);
  expect(hasInvalidLocaleValues({})).toBe(false);
});
