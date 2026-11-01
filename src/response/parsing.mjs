import { extractContentImage } from "./images/content.mjs";
import { extractGeneratedImage } from "./images/generated.mjs";
import { normalizeOutputs } from "./outputs.mjs";
import { getContentItems } from "./content.mjs";
import { collectResponseText } from "./text.mjs";

export function parseResponse(response) {
  const outputs = normalizeOutputs(response);
  const images = [];
  for (const out of outputs) {
    const generatedImage = extractGeneratedImage(out);
    if (generatedImage.handled) {
      if (generatedImage.image) images.push(generatedImage.image);
      continue;
    }
    for (const content of getContentItems(out)) {
      const extractedImage = extractContentImage(content);
      if (extractedImage.image) images.push(extractedImage.image);
      if (extractedImage.handled) continue;
    }
  }
  return { replyText: collectResponseText(outputs, response), images };
}
