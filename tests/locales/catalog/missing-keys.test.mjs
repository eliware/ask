import hasMissingLocaleKeys from "../../../src/locales/catalog/missing-keys.mjs";

test("detects missing locale keys", () => {
  expect(hasMissingLocaleKeys({ greeting: "Hello" }, ["greeting"])).toBe(false);
  expect(hasMissingLocaleKeys({}, ["greeting"])).toBe(true);
});
