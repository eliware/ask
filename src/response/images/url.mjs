export function extractImageUrl(content) {
  const url = content?.image?.url || content?.url || content?.src || content?.href;
  let validUrl = false;
  if (typeof url === "string" && url) {
    try {
      const parsed = new URL(url);
      validUrl = parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {}
  }
  return {
    handled: validUrl,
    image: validUrl
      ? {
          url,
          filename: content?.filename || "image.png",
          description: content?.description || null,
        }
      : null,
  };
}
