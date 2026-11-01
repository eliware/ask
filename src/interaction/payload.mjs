import { splitMessage } from "./splitting.mjs";

export async function prepareMessagePayloads(response) {
  const content = response?.content ?? response;
  const files = response?.files || null;
  const chunks = await splitMessage(
    typeof content === "string" ? content : JSON.stringify(content),
    2000,
  );
  return chunks.map((chunk, index) => (files && index === 0 ? { content: chunk, files } : chunk));
}
