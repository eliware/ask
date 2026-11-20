import decodeBase64Image from "../image-decoding.mjs";
import isGeneratedImageOutput from "./generated-predicate.mjs";

export default function extractGeneratedImage(output) {
  const isGeneratedImage = isGeneratedImageOutput(output);
  if (!isGeneratedImage) return { handled: false, image: null };
  const buffer = decodeBase64Image(output.result);
  return {
    handled: true,
    image: buffer
      ? {
          buffer,
          filename: `image_${output.id || Date.now()}.png`,
          mime: "image/png",
          description: output.revised_prompt || null,
        }
      : null,
  };
}
