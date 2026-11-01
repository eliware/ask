import { deliverMessageChunks } from "./chunk-delivery.mjs";
import { prepareMessagePayloads } from "./payload.mjs";
import { attachFilesToFirstChunk } from "./attachments.mjs";

export function createMessageSender(message) {
  return async function send(response, ephemeral = false) {
    const chunks = await prepareMessagePayloads(response);
    const payloads = attachFilesToFirstChunk(chunks, response?.files || null);
    await deliverMessageChunks(message, payloads, ephemeral);
  };
}
