import extractContentImage from "./content.mjs";
import extractGeneratedImage from "./generated.mjs";
import __contentModule from "../content.mjs";

const { getContentItems } = __contentModule;

export default function extractOutputImages(output) {
  const generatedImage = extractGeneratedImage(output);
  if (generatedImage.handled) return generatedImage.image ? [generatedImage.image] : [];
  const images = [];
  for (const content of getContentItems(output)) {
    const extractedImage = extractContentImage(content);
    if (extractedImage.image) images.push(extractedImage.image);
  }
  return images;
}
