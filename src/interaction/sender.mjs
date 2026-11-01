import { splitMessage } from "./splitting.mjs";
import { deliverMessageChunk } from "./delivery.mjs";

export function createMessageSender(message) {
  return async function send(response, ephemeral = false) {
    const content = response?.content ?? response;
    const files = response?.files || null;
    const chunks = await splitMessage(
      typeof content === "string" ? content : JSON.stringify(content),
      2000,
    );
    const sendOne = async (chunk, first) => {
      const payload = files && first ? { content: chunk, files } : chunk;
      return deliverMessageChunk(message, payload, ephemeral, first);
    };
    for (let i = 0; i < chunks.length; i++) await sendOne(chunks[i], i === 0);
  };
}
