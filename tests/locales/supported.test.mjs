import { expect, test } from "@jest/globals";
import { supportedLocales } from "../../src/locales/supported.mjs";

test("lists each supported locale once", () => {
  expect(new Set(supportedLocales).size).toBe(supportedLocales.length);
  expect(supportedLocales).toContain("en-US");
  expect(supportedLocales).toContain("zh-TW");
});
