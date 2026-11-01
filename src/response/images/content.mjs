import { decodeBase64Image } from "../image-decoding.mjs";

export function extractContentImage(content) {
  const base64 =
    content?.b64_json ||
    content?.base64 ||
    content?.image?.b64 ||
    content?.image?.b64_json ||
    content?.image?.base64;
  if (typeof base64 === "string" && base64) {
    const buffer = decodeBase64Image(base64);
    return {
      handled: true,
      image: buffer
        ? {
            buffer,
            filename: content?.filename || "image.png",
            mime: content?.mime || "image/png",
            description: content?.description || null,
          }
        : null,
    };
  }
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
