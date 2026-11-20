import deliverMessageChunks from "./chunk-delivery.mjs";
import prepareSenderPayloads from "./sender/payloads.mjs";

export default function createMessageSender(message) {
  return async function send(response, ephemeral = false) {
    const payloads = await prepareSenderPayloads(response);
    await deliverMessageChunks(message, payloads, ephemeral);
  };
}
