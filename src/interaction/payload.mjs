import splitMessage from "./splitting.mjs";
import serializeMessageContent from "./serialization.mjs";

export default async function prepareMessagePayloads(response) {
  return splitMessage(serializeMessageContent(response), 2000);
}
