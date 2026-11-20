import { defaultRedactPatterns } from "./redaction.mjs";
import truncateLogField from "./field-truncation.mjs";
import sanitizeLogValue from "./sanitizer.mjs";

export default function sanitizeForLog(obj, seen = new WeakSet(), depth = 0, opts = {}) {
  const {
    maxDepth = 5,
    maxString = 1000,
    maxArray = 100,
    maxEntries = 200,
    redactPatterns = defaultRedactPatterns,
  } = opts || {};
  const options = { maxDepth, maxString, maxArray, maxEntries, redactPatterns };
  return sanitizeLogValue(obj, seen, depth, options, truncateLogField);
}
