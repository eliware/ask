export const defaultRedactPatterns = [
  "b64",
  "base64",
  "b64_json",
  "result",
  "image",
  "data",
  "raw",
  "buffer",
  "blob",
];

export function redactStringField(key, value, patterns) {
  if (typeof value !== "string") return undefined;
  const lower = String(key).toLowerCase();
  return patterns.some((pattern) => lower.includes(pattern))
    ? `<<redacted ${lower} length=${value.length}>>`
    : undefined;
}
