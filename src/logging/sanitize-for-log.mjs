import { defaultRedactPatterns } from "./redaction.mjs";
import { truncateLogField } from "./strings.mjs";
import { traverseLogValue } from "./traversal.mjs";
import { normalizeLogValue } from "./values.mjs";

export default function sanitizeForLog(obj, seen = new WeakSet(), depth = 0, opts = {}) {
  const {
    maxDepth = 5,
    maxString = 1000,
    maxArray = 100,
    maxEntries = 200,
    redactPatterns = defaultRedactPatterns,
  } = opts || {};
  const options = { maxDepth, maxString, maxArray, maxEntries, redactPatterns };
  const sanitizeValue = (value, visited, level) => {
    if (level > maxDepth) return "<<max-depth>>";
    const normalized = normalizeLogValue(value, maxString);
    if (normalized.handled) return normalized.value;
    return traverseLogValue(value, sanitizeValue, visited, level, options, truncateLogField);
  };
  return sanitizeValue(obj, seen, depth);
}
