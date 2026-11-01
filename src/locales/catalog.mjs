import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { supportedLocales } from "./supported.mjs";

export function validateLocaleCatalog(
  directory = join(process.cwd(), "locales"),
  fileSystem = { readFileSync, readdirSync },
) {
  const files = fileSystem.readdirSync(directory).filter((file) => file.endsWith(".json"));
  const names = files.map((file) => file.slice(0, -5));
  const reference = JSON.parse(fileSystem.readFileSync(join(directory, "en-US.json"), "utf8"));
  const referenceKeys = Object.keys(reference);
  const errors = [];
  for (const locale of supportedLocales) {
    if (!names.includes(locale)) errors.push("missing " + locale);
  }
  for (const file of files) {
    const values = JSON.parse(fileSystem.readFileSync(join(directory, file), "utf8"));
    const missing = referenceKeys.filter((key) => !(key in values));
    const extra = Object.keys(values).filter((key) => !referenceKeys.includes(key));
    if (missing.length || extra.length) errors.push(file);
  }
  return errors;
}
