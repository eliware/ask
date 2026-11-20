import splitMessage from "./splitting.mjs";

export default async function prepareMessagePayloads(response) {
  const content = response?.content ?? response;
  return splitMessage(typeof content === "string" ? content : JSON.stringify(content), 2000);
}
