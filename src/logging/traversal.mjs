import { traverseObjectFields } from "./object-fields.mjs";

export function traverseLogValue(obj, sanitizeValue, seen, depth, opts, truncateLogField) {
  const { maxArray } = opts;
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
  return traverseObjectFields(obj, sanitizeValue, seen, depth, opts, truncateLogField);
}
