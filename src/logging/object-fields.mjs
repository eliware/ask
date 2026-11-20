import sanitizeObjectField from "./field.mjs";

export default function traverseObjectFields(
  obj,
  sanitizeValue,
  seen,
  depth,
  opts,
  truncateLogField,
) {
  const { maxEntries } = opts;
  const out = {};
  let count = 0;
  let entries;
  try {
    entries = Object.entries(obj);
  } catch (error) {
    return `<<error serializing: ${String(error)}>>`;
  }
  for (const [key, value] of entries) {
    if (++count > maxEntries) {
      out.__more = `<<truncated, more than ${maxEntries} keys>>`;
      break;
    }
    out[key] = sanitizeObjectField(key, value, sanitizeValue, seen, depth, opts, truncateLogField);
  }
  return out;
}
