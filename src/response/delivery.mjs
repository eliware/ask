import { deliverMessageResponse } from "./message-delivery.mjs";
import { deliverSlashResponse } from "./slash-delivery.mjs";
import { prepareResponsePayload } from "./payload.mjs";
export async function deliverResponse(interaction, replyText, images, deferred, log) {
  const { text, files, urls } = prepareResponsePayload(replyText, images);
  if (interaction._omitBlockquote)
    return deliverMessageResponse(interaction, text, files, urls, deferred);
  return deliverSlashResponse(interaction, text, files, urls, deferred, log);
}
