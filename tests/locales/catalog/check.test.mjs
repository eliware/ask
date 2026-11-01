import { expect, test } from "@jest/globals";
import { validateLocaleCatalog } from "../../../src/locales/catalog/check.mjs";

test("locale catalog is complete and consistent", () => {
  expect(validateLocaleCatalog()).toEqual([]);
});
