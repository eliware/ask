import findMissingLocales from "./missing.mjs";
import hasMissingLocaleKeys from "./missing-keys.mjs";
import hasExtraLocaleKeys from "./extra-keys.mjs";
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
      hasMissingLocaleKeys(localizedValues, referenceKeys) ||
      hasExtraLocaleKeys(localizedValues, referenceKeys) ||
      hasInvalidLocaleValues(localizedValues)
    )
      errors.push(file);
  }
  return errors;
}
