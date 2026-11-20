import traverseLogValue from "./traversal.mjs";
import normalizeLogValue from "./values.mjs";

export default function sanitizeLogValue(value, seen, level, options, truncateLogField) {
  if (level > options.maxDepth) return "<<max-depth>>";
  const normalized = normalizeLogValue(value, options.maxString);
  if (normalized.handled) return normalized.value;
  const sanitizeChild = (child, visited, depth) =>
    sanitizeLogValue(child, visited, depth, options, truncateLogField);
  return traverseLogValue(value, sanitizeChild, seen, level, options, truncateLogField);
}
