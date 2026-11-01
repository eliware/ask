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
    if (missing.length || extra.length) errors.push(file);
  }
  return errors;
}
