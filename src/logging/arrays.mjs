export default function traverseLogArray(array, sanitizeValue, seen, depth, maxArray) {
  if (seen.has(array)) return "<<circular>>";
  seen.add(array);
  const out = [];
  for (let i = 0; i < Math.min(array.length, maxArray); i++) {
    try {
      out.push(sanitizeValue(array[i], seen, depth + 1));
    } catch (error) {
      out.push(`<<error serializing index ${i}: ${String(error)}>>`);
    }
  }
  if (array.length > maxArray) out.push(`<<${array.length - maxArray} more items...>>`);
  return out;
}
