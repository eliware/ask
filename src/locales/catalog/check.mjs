import { join } from "node:path";
import { loadLocaleCatalogFiles } from "./files.mjs";
import { supportedLocales } from "../supported.mjs";
import { validateLocaleCatalogData } from "./validation.mjs";

export function validateLocaleCatalog(directory = join(process.cwd(), "locales"), fileSystem) {
  const catalog = loadLocaleCatalogFiles(directory, fileSystem);
  return validateLocaleCatalogData(catalog, supportedLocales);
}
