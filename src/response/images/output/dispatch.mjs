import extractContentOutputImages from "../content-output.mjs";
import extractGeneratedImage from "../generated.mjs";

export default function extractOutputImages(output) {
  const generatedImage = extractGeneratedImage(output);
  if (generatedImage.handled) return generatedImage.image ? [generatedImage.image] : [];
  return extractContentOutputImages(output);
}
