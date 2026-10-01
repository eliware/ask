import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const localeKeys = [
  "bg",
  "cs",
  "da",
  "de",
  "el",
  "en-GB",
  "en-US",
  "es-419",
  "es-ES",
  "fi",
  "fr",
  "hi",
  "hr",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "lt",
  "nl",
  "no",
  "pl",
  "pt-BR",
  "ro",
  "ru",
  "sv-SE",
  "th",
  "tr",
  "uk",
  "vi",
  "zh-CN",
  "zh-TW",
];
const namePattern = /^[-_'\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u;

function validName(value) {
  return typeof value === "string" && namePattern.test(value);
}

function validLocalizedValues(values) {
  return (
    values &&
    localeKeys.every((locale) => typeof values[locale] === "string" && validName(values[locale]))
  );
}

export function validateDiscordCommand(name) {
  const filePath = join(process.cwd(), "commands", name + ".json");
  const command = JSON.parse(readFileSync(filePath, "utf8"));
  const errors = [];
  if (command.type !== 1) errors.push("type");
  if (!validName(command.name)) errors.push("name");
  if (!validLocalizedValues(command.name_localizations)) errors.push("name_localizations");
  if (typeof command.description !== "string" || !command.description) errors.push("description");
  if (
    !command.description_localizations ||
    !localeKeys.every((locale) => command.description_localizations[locale])
  )
    errors.push("description_localizations");
  for (const option of command.options ?? []) {
    if (!validName(option.name)) errors.push("option name");
    if (!validLocalizedValues(option.name_localizations)) errors.push("option name_localizations");
    if (
      !option.description_localizations ||
      !localeKeys.every((locale) => option.description_localizations[locale])
    )
      errors.push("option description_localizations");
  }
  return errors;
}

export function validateLocaleCatalog() {
  const directory = join(process.cwd(), "locales");
  const files = readdirSync(directory).filter((file) => file.endsWith(".json"));
  const names = files.map((file) => file.slice(0, -5));
  const reference = JSON.parse(readFileSync(join(directory, "en-US.json"), "utf8"));
  const referenceKeys = Object.keys(reference);
  const errors = [];
  for (const locale of localeKeys) {
    if (!names.includes(locale)) errors.push("missing " + locale);
  }
  for (const file of files) {
    const values = JSON.parse(readFileSync(join(directory, file), "utf8"));
    const missing = referenceKeys.filter((key) => !(key in values));
    const extra = Object.keys(values).filter((key) => !referenceKeys.includes(key));
    if (missing.length || extra.length) errors.push(file);
  }
  return errors;
}
