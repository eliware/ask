import traverseObjectFields from "./object-fields.mjs";
import traverseLogArray from "./arrays.mjs";

export default function traverseLogValue(obj, sanitizeValue, seen, depth, opts, truncateLogField) {
  if (Array.isArray(obj)) return traverseLogArray(obj, sanitizeValue, seen, depth, opts.maxArray);
  if (seen.has(obj)) return "<<circular>>";
  seen.add(obj);
  return traverseObjectFields(obj, sanitizeValue, seen, depth, opts, truncateLogField);
}
