export function decodeBase64Image(value) {
  try {
    if (
      typeof value !== "string" ||
      !value ||
      value.length % 4 !== 0 ||
      !/^[A-Za-z0-9+/]*={0,2}$/.test(value)
    )
      return null;
    return Buffer.from(value, "base64");
  } catch {
    return null;
  }
}

export function extractGeneratedImage(output) {
  const isGeneratedImage =
    output &&
    (output.type === "image_generation_call" ||
      (output.id && String(output.id).startsWith("ig_"))) &&
    typeof output.result === "string";
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

export function extractContentImage(content) {
  const base64 =
    content?.b64_json ||
    content?.base64 ||
    content?.image?.b64 ||
    content?.image?.b64_json ||
    content?.image?.base64;
  if (typeof base64 === "string" && base64) {
    const buffer = decodeBase64Image(base64);
    return {
      handled: true,
      image: buffer
        ? {
            buffer,
            filename: content?.filename || "image.png",
            mime: content?.mime || "image/png",
            description: content?.description || null,
          }
        : null,
    };
  }
  const url = content?.image?.url || content?.url || content?.src || content?.href;
  return {
    handled: typeof url === "string" && Boolean(url),
    image:
      typeof url === "string" && url
        ? {
            url,
            filename: content?.filename || "image.png",
            description: content?.description || null,
          }
        : null,
  };
}
