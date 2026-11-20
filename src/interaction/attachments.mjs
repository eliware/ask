export default function attachFilesToFirstChunk(chunks, files) {
  if (!files?.length) return chunks;
  if (!chunks.length) return [{ files }];
  return chunks.map((chunk, index) => (index === 0 ? { content: chunk, files } : chunk));
}
