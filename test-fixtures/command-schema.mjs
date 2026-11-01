import { supportedLocales } from "../src/locales/supported.mjs";

const namePattern = /^[-_'\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u;

function validName(value) {
  return typeof value === "string" && namePattern.test(value);
}

function validLocalizedValues(values) {
  return (
    values &&
    supportedLocales.every(
      (locale) => typeof values[locale] === "string" && validName(values[locale]),
    )
  );
}

export function validateDiscordCommandDefinition(command) {
  const errors = [];
  if (command.type !== 1) errors.push("type");
  if (!validName(command.name)) errors.push("name");
  if (!validLocalizedValues(command.name_localizations)) errors.push("name_localizations");
  if (typeof command.description !== "string" || !command.description) errors.push("description");
  if (
    !command.description_localizations ||
    !supportedLocales.every((locale) => command.description_localizations[locale])
  )
    errors.push("description_localizations");
  for (const option of command.options ?? []) {
    if (!validName(option.name)) errors.push("option name");
    if (!validLocalizedValues(option.name_localizations)) errors.push("option name_localizations");
    if (
      !option.description_localizations ||
      !supportedLocales.every((locale) => option.description_localizations[locale])
    )
      errors.push("option description_localizations");
  }
  return errors;
}
