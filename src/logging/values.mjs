import { sanitizeLogString } from "./strings.mjs";

export function normalizeLogValue(value, maxString) {
  if (value === null || value === undefined) return { handled: true, value };
  if (typeof value === "string")
    return { handled: true, value: sanitizeLogString(value, maxString) };
  if (typeof value === "number" || typeof value === "boolean") return { handled: true, value };
  if (Buffer.isBuffer(value)) return { handled: true, value: `[Buffer length=${value.length}]` };
  if (typeof value === "object") return { handled: false };
  return { handled: true, value: String(value) };
}
