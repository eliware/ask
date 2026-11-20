export default function hasLocaleKeyMismatch(values, referenceKeys) {
  const missing = referenceKeys.some((key) => !(key in values));
  const extra = Object.keys(values).some((key) => !referenceKeys.includes(key));
  return missing || extra;
}
