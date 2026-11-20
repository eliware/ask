import redactStringField from "./redaction.mjs";

export default function sanitizeObjectField(
  key,
  value,
  sanitizeValue,
  seen,
  depth,
  opts,
  truncateLogField,
) {
  try {
    const redacted = redactStringField(key, value, opts.redactPatterns);
    if (redacted !== undefined) return redacted;
    if (typeof value === "string" && value.length > opts.maxString)
      return truncateLogField(value, opts.maxString);
    return sanitizeValue(value, seen, depth + 1);
  } catch (error) {
    return `<<error serializing: ${String(error)}>>`;
  }
}
