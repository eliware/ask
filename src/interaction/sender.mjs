import { deliverMessageChunks } from "./chunk-delivery.mjs";
import { prepareMessagePayloads } from "./payload.mjs";

export function createMessageSender(message) {
  return async function send(response, ephemeral = false) {
    const payloads = await prepareMessagePayloads(response);
    await deliverMessageChunks(message, payloads, ephemeral);
  };
}
