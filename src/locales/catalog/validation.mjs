import findMissingLocales from "./missing.mjs";
import hasLocaleKeyMismatch from "./keys.mjs";
import hasInvalidLocaleValues from "./values.mjs";

export default function validateLocaleCatalogData(
  { files, names, values, reference },
  supportedLocales,
) {
  const referenceKeys = Object.keys(reference);
  const errors = findMissingLocales(names, supportedLocales);
  for (const file of files) {
    const localizedValues = values[file];
    if (
      hasLocaleKeyMismatch(localizedValues, referenceKeys) ||
      hasInvalidLocaleValues(localizedValues)
    )
      errors.push(file);
  }
  return errors;
}
