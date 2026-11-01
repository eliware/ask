export function extractImageUrl(content) {
  const url = content?.image?.url || content?.url || content?.src || content?.href;
  return {
    handled: typeof url === "string" && Boolean(url),
    image:
      typeof url === "string" && url
        ? {
            url,
            filename: content?.filename || "image.png",
            description: content?.description || null,
          }
        : null,
  };
}
