export default function hasMissingLocaleKeys(values, referenceKeys) {
  return referenceKeys.some((key) => !(key in values));
}
