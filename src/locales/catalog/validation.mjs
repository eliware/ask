export function validateLocaleCatalogData({ files, names, values, reference }, supportedLocales) {
  const referenceKeys = Object.keys(reference);
  const errors = [];
  for (const locale of supportedLocales) {
    if (!names.includes(locale)) errors.push("missing " + locale);
  }
  for (const file of files) {
    const localizedValues = values[file];
    const missing = referenceKeys.filter((key) => !(key in localizedValues));
    const extra = Object.keys(localizedValues).filter((key) => !referenceKeys.includes(key));
    const empty = Object.values(localizedValues).some(
      (value) => typeof value !== "string" || !value.trim(),
    );
    if (missing.length || extra.length || empty) errors.push(file);
  }
  return errors;
}
