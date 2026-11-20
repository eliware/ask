import isSupportedImageUrl from "./url-validation.mjs";

export default function extractImageUrl(content) {
  const url = content?.image?.url || content?.url || content?.src || content?.href;
  const validUrl = isSupportedImageUrl(url);
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
