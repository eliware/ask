export default function generatedImageFilename(id) {
  const safeId = String(id || "")
    .replace(/[^a-zA-Z0-9_-]+/gu, "_")
    .replace(/^_+|_+$/gu, "");
  return `image_${safeId || Date.now()}.png`;
}
