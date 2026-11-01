import { decodeBase64Image } from "../image-decoding.mjs";

export function isGeneratedImageOutput(output) {
  return Boolean(
    output &&
    (output.type === "image_generation_call" ||
      (output.id && String(output.id).startsWith("ig_"))) &&
    typeof output.result === "string",
  );
}

export function extractGeneratedImage(output) {
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
