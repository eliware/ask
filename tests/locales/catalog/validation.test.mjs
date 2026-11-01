import { expect, test } from "@jest/globals";
import { validateLocaleCatalogData } from "../../../src/locales/catalog/validation.mjs";

test("reports missing locales and locale key mismatches", () => {
  const catalog = {
    files: ["en-US.json", "fr.json", "de.json", "it.json"],
    names: ["en-US", "fr", "de", "it"],
    values: {
      "en-US.json": { expected: "value" },
      "fr.json": { expected: "value", extra: "value" },
      "de.json": {},
      "it.json": { extra: "value" },
    },
    reference: { expected: "value" },
  };

  const errors = validateLocaleCatalogData(catalog, ["en-US", "fr", "de", "it", "bg"]);

  expect(errors).toContain("missing bg");
  expect(errors).toContain("fr.json");
  expect(errors).toContain("de.json");
  expect(errors).toContain("it.json");
  expect(errors).not.toContain("en-US.json");
});

test("reports empty locale values", () => {
  const catalog = {
    files: ["en-US.json", "fr.json"],
    names: ["en-US", "fr"],
    values: { "en-US.json": { greeting: "Hello" }, "fr.json": { greeting: " " } },
    reference: { greeting: "Hello" },
  };

  expect(validateLocaleCatalogData(catalog, ["en-US", "fr"])).toContain("fr.json");
});
