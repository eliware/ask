import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function loadLocaleCatalogFiles(directory, fileSystem = { readFileSync, readdirSync }) {
  const files = fileSystem.readdirSync(directory).filter((file) => file.endsWith(".json"));
  const names = files.map((file) => file.slice(0, -5));
  const values = Object.fromEntries(
    files.map((file) => [file, JSON.parse(fileSystem.readFileSync(join(directory, file), "utf8"))]),
  );
  return { files, names, values, reference: values["en-US.json"] };
}
