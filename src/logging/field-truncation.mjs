export default function truncateLogField(value, maxString) {
  return `${value.slice(0, Math.min(200, maxString))}...[truncated length=${value.length}]`;
}
