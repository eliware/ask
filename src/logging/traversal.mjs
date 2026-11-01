import { redactStringField } from "./redaction.mjs";

export function traverseLogValue(obj, sanitizeValue, seen, depth, opts, truncateLogField) {
  const { maxString, maxArray, maxEntries, redactPatterns } = opts;
  if (Array.isArray(obj)) {
    if (seen.has(obj)) return "<<circular>>";
    seen.add(obj);
    const out = [];
    for (let i = 0; i < Math.min(obj.length, maxArray); i++) {
      try {
        out.push(sanitizeValue(obj[i], seen, depth + 1));
      } catch (error) {
        out.push(`<<error serializing index ${i}: ${String(error)}>>`);
      }
    }
    if (obj.length > maxArray) out.push(`<<${obj.length - maxArray} more items...>>`);
    return out;
  }
  if (seen.has(obj)) return "<<circular>>";
  seen.add(obj);
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
