export default function hasInvalidLocaleValues(values) {
  return Object.values(values).some((value) => typeof value !== "string" || !value.trim());
}
