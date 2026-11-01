import { deliverMessageResponse } from "./message-delivery.mjs";
import { deliverSlashResponse } from "./slash-delivery.mjs";
export async function deliverResponse(interaction, replyText, images, deferred, log) {
  const text = typeof replyText === "string" ? replyText.trim() : "";
  const files = images
    .filter((image) => image.buffer)
    .map((image) => ({ attachment: image.buffer, name: image.filename }));
  const urls = images.filter((image) => image.url).map((image) => image.url);
  if (interaction._omitBlockquote)
    return deliverMessageResponse(interaction, text, files, urls, deferred);
  return deliverSlashResponse(interaction, text, files, urls, deferred, log);
}
