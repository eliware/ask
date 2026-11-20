import extractContentImage from "./content/dispatch.mjs";
import __contentModule from "../content.mjs";

const { getContentItems } = __contentModule;

export default function extractContentOutputImages(output) {
  const images = [];
  for (const content of getContentItems(output)) {
    const extractedImage = extractContentImage(content);
    if (extractedImage.image) images.push(extractedImage.image);
  }
  return images;
}
