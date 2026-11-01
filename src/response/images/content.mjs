import { extractBase64ContentImage } from "./base64.mjs";
import { extractImageUrl } from "./url.mjs";

export function extractContentImage(content) {
  const base64Image = extractBase64ContentImage(content);
  return base64Image.handled ? base64Image : extractImageUrl(content);
}
