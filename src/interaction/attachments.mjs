export function attachFilesToFirstChunk(chunks, files) {
  if (!files) return chunks;
  return chunks.map((chunk, index) => (index === 0 ? { content: chunk, files } : chunk));
}
