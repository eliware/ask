export function prepareResponsePayload(replyText, images) {
  return {
    text: typeof replyText === "string" ? replyText.trim() : "",
    files: images
      .filter((image) => image.buffer)
      .map((image) => ({ attachment: image.buffer, name: image.filename })),
    urls: images.filter((image) => image.url).map((image) => image.url),
  };
}
