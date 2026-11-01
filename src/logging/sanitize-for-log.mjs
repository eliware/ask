import { defaultRedactPatterns } from "./redaction.mjs";
import { sanitizeLogString, truncateLogField } from "./strings.mjs";
import { traverseLogValue } from "./traversal.mjs";

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
    if (value === null || value === undefined) return value;
    if (typeof value === "string") return sanitizeLogString(value, maxString);
    if (typeof value === "number" || typeof value === "boolean") return value;
    if (Buffer.isBuffer(value)) return `[Buffer length=${value.length}]`;
    if (typeof value === "object")
      return traverseLogValue(value, sanitizeValue, visited, level, options, truncateLogField);
    return String(value);
  };
  return sanitizeValue(obj, seen, depth);
}
