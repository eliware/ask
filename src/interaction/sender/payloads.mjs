import attachFilesToFirstChunk from "../attachments.mjs";
import prepareMessagePayloads from "../payload.mjs";

export default async function prepareSenderPayloads(response) {
  const chunks = await prepareMessagePayloads(response);
  return attachFilesToFirstChunk(chunks, response?.files || null);
}
