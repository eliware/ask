export function extractViolations(error) {
  if (Array.isArray(error?.error?.safety_violations))
    return error.error.safety_violations.map(String);
  const match = String(error?.message || error || "").match(/safety_violations=\[([^\]]+)\]/i);
  return match
    ? match[1]
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    : [];
}
