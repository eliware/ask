import decodeBase64Image from "../image-decoding.mjs";
import isGeneratedImageOutput from "./generated/predicate.mjs";
import generatedImageFilename from "./generated/filename.mjs";

export default function extractGeneratedImage(output) {
  const isGeneratedImage = isGeneratedImageOutput(output);
  if (!isGeneratedImage) return { handled: false, image: null };
  const buffer = decodeBase64Image(output.result);
  return {
    handled: true,
    image: buffer
      ? {
          buffer,
          filename: generatedImageFilename(output.id),
          mime: "image/png",
          description: output.revised_prompt || null,
        }
      : null,
  };
}
