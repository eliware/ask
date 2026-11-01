import { deliverMessageChunk } from "./delivery.mjs";
import { prepareMessagePayloads } from "./payload.mjs";

export function createMessageSender(message) {
  return async function send(response, ephemeral = false) {
    const payloads = await prepareMessagePayloads(response);
    const sendOne = async (chunk, first) => {
      return deliverMessageChunk(message, chunk, ephemeral, first);
    };
    for (let i = 0; i < payloads.length; i++) await sendOne(payloads[i], i === 0);
  };
}
