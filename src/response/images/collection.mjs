import extractOutputImages from "./output/dispatch.mjs";

export default function collectResponseImages(outputs) {
  const images = [];
  for (const output of outputs) images.push(...extractOutputImages(output));
  return images;
}
