export default function sanitizeForLog(obj, seen = new WeakSet(), depth = 0, opts = {}) {
  const { maxDepth = 5, maxString = 1000, maxArray = 100, maxEntries = 200,
    redactPatterns = ['b64', 'base64', 'b64_json', 'result', 'image', 'data', 'raw', 'buffer', 'blob'] } = opts || {};
  if (depth > maxDepth) return '<<max-depth>>';
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    const nonPrintable = obj.replace(/[\x20-\x7E\n\r\t]/g, '').length;
    return obj.length > maxString || nonPrintable > Math.min(100, obj.length / 10)
      ? `<<string length=${obj.length} truncated, nonprintable=${nonPrintable}>>` : obj;
  }
  if (typeof obj === 'number' || typeof obj === 'boolean') return obj;
  if (Buffer.isBuffer(obj)) return `[Buffer length=${obj.length}]`;
  if (Array.isArray(obj)) {
    if (seen.has(obj)) return '<<circular>>'; seen.add(obj);
    const out = [];
    for (let i = 0; i < Math.min(obj.length, maxArray); i++) {
      try { out.push(sanitizeForLog(obj[i], seen, depth + 1, opts)); } catch (err) { out.push(`<<error serializing index ${i}: ${String(err)}>>`); }
    }
    if (obj.length > maxArray) out.push(`<<${obj.length - maxArray} more items...>>`);
    return out;
  }
  if (typeof obj === 'object') {
    if (seen.has(obj)) return '<<circular>>'; seen.add(obj);
    const out = {}; let count = 0;
    for (const [key, value] of Object.entries(obj)) {
      if (++count > maxEntries) { out.__more = `<<truncated, more than ${maxEntries} keys>>`; break; }
      try {
        const lower = String(key).toLowerCase();
        if (typeof value === 'string' && redactPatterns.some(pattern => lower.includes(pattern))) out[key] = `<<redacted ${lower} length=${value.length}>>`;
        else if (typeof value === 'string' && value.length > maxString) out[key] = `${value.slice(0, Math.min(200, maxString))}...[truncated length=${value.length}]`;
        else out[key] = sanitizeForLog(value, seen, depth + 1, opts);
      } catch (err) { out[key] = `<<error serializing: ${String(err)}>>`; }
    }
    return out;
  }
  return String(obj);
}
