import { extractContentImage, extractGeneratedImage } from "./images.mjs";
import { getFallbackText, normalizeOutputs } from "./outputs.mjs";

export function parseResponse(response) {
  let replyText = "";
  const images = [];
  for (const out of normalizeOutputs(response)) {
    const generatedImage = extractGeneratedImage(out);
    if (generatedImage.handled) {
      if (generatedImage.image) images.push(generatedImage.image);
      continue;
    }
    let contents = Array.isArray(out?.content)
      ? out.content
      : out?.content && typeof out.content === "object"
        ? Object.values(out.content)
        : typeof out?.content === "string"
          ? [out.content]
          : Array.isArray(out?.data)
            ? out.data
            : out?.data && typeof out.data === "object"
              ? Object.values(out.data)
              : typeof out === "string"
                ? [out]
                : [];
    for (const content of contents) {
      const text =
        typeof content === "string"
          ? content
          : content?.text || content?.output_text || content?.content;
      if (typeof text === "string" && text) replyText += (replyText ? "\n" : "") + text;
      const extractedImage = extractContentImage(content);
      if (extractedImage.image) images.push(extractedImage.image);
      if (extractedImage.handled) continue;
    }
  }
  return {
    replyText:
      replyText || getFallbackText(response?.output_text) || getFallbackText(response?.text),
    images,
  };
}
