import { extractContentImage } from "./images/content.mjs";
import { extractGeneratedImage } from "./images/generated.mjs";
import { normalizeOutputs, selectFallbackText } from "./outputs.mjs";
import { extractContentText, getContentItems } from "./content.mjs";

export function parseResponse(response) {
  let replyText = "";
  const images = [];
  for (const out of normalizeOutputs(response)) {
    const generatedImage = extractGeneratedImage(out);
    if (generatedImage.handled) {
      if (generatedImage.image) images.push(generatedImage.image);
      continue;
    }
    for (const content of getContentItems(out)) {
      const text = extractContentText(content);
      if (text) replyText += (replyText ? "\n" : "") + text;
      const extractedImage = extractContentImage(content);
      if (extractedImage.image) images.push(extractedImage.image);
      if (extractedImage.handled) continue;
    }
  }
  return {
    replyText: selectFallbackText(replyText, response),
    images,
  };
}
