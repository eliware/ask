export default function isGeneratedImageOutput(output) {
  return Boolean(
    output &&
    (output.type === "image_generation_call" ||
      (output.id && String(output.id).startsWith("ig_"))) &&
    typeof output.result === "string",
  );
}
