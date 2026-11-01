import { expect, test } from "@jest/globals";
import { validateLocaleCatalog } from "../../../src/locales/catalog/check.mjs";

test("locale catalog is complete and consistent", () => {
  expect(validateLocaleCatalog()).toEqual([]);
});

test("reports missing locales and locale key mismatches", () => {
  const localeData = {
    "en-US.json": { expected: "value" },
    "fr.json": { expected: "value", extra: "value" },
    "de.json": {},
    "it.json": { extra: "value" },
  };
  const fileSystem = {
    readdirSync: () => [...Object.keys(localeData), "notes.txt"],
    readFileSync: (path) => JSON.stringify(localeData[path.split(/[\\/]/u).at(-1)]),
  };

  const errors = validateLocaleCatalog("locales", fileSystem);

  expect(errors).toContain("missing bg");
  expect(errors).toContain("fr.json");
  expect(errors).toContain("de.json");
  expect(errors).toContain("it.json");
  expect(errors).not.toContain("notes.txt");
});
