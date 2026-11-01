import { deliverMessageChunk } from "./delivery.mjs";

export async function deliverMessageChunks(message, payloads, ephemeral) {
  for (let index = 0; index < payloads.length; index++) {
    await deliverMessageChunk(message, payloads[index], ephemeral, index === 0);
  }
}
