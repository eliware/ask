import { decodeBase64Image } from "../image-decoding.mjs";

export function extractBase64ContentImage(content) {
  const base64 =
    content?.b64_json ||
    content?.base64 ||
    content?.image?.b64 ||
    content?.image?.b64_json ||
    content?.image?.base64;
  if (typeof base64 !== "string" || !base64) return { handled: false, image: null };
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
