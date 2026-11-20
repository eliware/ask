export default function sanitizeLogString(value, maxString) {
  const nonPrintable = value.replace(/[\x20-\x7E\n\r\t]/g, "").length;
  return value.length > maxString || nonPrintable > Math.min(100, value.length / 10)
    ? `<<string length=${value.length} truncated, nonprintable=${nonPrintable}>>`
    : value;
}
