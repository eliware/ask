import { expect, jest, test } from "@jest/globals";
import { loadLocaleCatalogFiles } from "../../../src/locales/catalog/files.mjs";

test("loads only JSON locale files and reads their catalogs", () => {
  const localeData = { "en-US.json": { expected: "value" }, "fr.json": { expected: "value" } };
  const readFileSync = jest.fn((path) => JSON.stringify(localeData[path.split(/[\\/]/u).at(-1)]));
  const readdirSync = jest.fn(() => [...Object.keys(localeData), "notes.txt"]);

  const files = loadLocaleCatalogFiles("locales", { readFileSync, readdirSync });

  expect(files.files).toEqual(["en-US.json", "fr.json"]);
  expect(files.names).toEqual(["en-US", "fr"]);
  expect(files.reference).toEqual(localeData["en-US.json"]);
  expect(readFileSync).toHaveBeenCalledTimes(2);
  expect(readdirSync).toHaveBeenCalledWith("locales");
});
