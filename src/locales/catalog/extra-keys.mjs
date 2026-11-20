export default function hasExtraLocaleKeys(values, referenceKeys) {
  return Object.keys(values).some((key) => !referenceKeys.includes(key));
}
