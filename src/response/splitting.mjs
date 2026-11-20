export default function defaultSplit(text, max) {
  const chunks = [];
  for (let index = 0; index < text.length; index += max)
    chunks.push(text.slice(index, index + max));
  return chunks;
}
