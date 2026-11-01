import { redactStringField } from "./redaction.mjs";

export function traverseObjectFields(obj, sanitizeValue, seen, depth, opts, truncateLogField) {
  const { maxString, maxEntries, redactPatterns } = opts;
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
    try {
      const redacted = redactStringField(key, value, redactPatterns);
      if (redacted !== undefined) out[key] = redacted;
      else if (typeof value === "string" && value.length > maxString)
        out[key] = truncateLogField(value, maxString);
      else out[key] = sanitizeValue(value, seen, depth + 1);
    } catch (error) {
      out[key] = `<<error serializing: ${String(error)}>>`;
    }
  }
  return out;
}
