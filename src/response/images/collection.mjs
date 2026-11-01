import { extractContentImage } from "./content.mjs";
import { extractGeneratedImage } from "./generated.mjs";
import { getContentItems } from "../content.mjs";

export function collectResponseImages(outputs) {
  const images = [];
  for (const output of outputs) {
    const generatedImage = extractGeneratedImage(output);
    if (generatedImage.handled) {
      if (generatedImage.image) images.push(generatedImage.image);
      continue;
    }
    for (const content of getContentItems(output)) {
      const extractedImage = extractContentImage(content);
      if (extractedImage.image) images.push(extractedImage.image);
    }
  }
  return images;
}
