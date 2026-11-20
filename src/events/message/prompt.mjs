import __addressingModule from "./addressing.mjs";
const { removeNameAddress } = __addressingModule;
import removeMessageMentions from "./mentions.mjs";

export default function extractMessagePrompt(content, addressedByName) {
  const addressedText = addressedByName ? removeNameAddress(content) : content;
  return removeMessageMentions(addressedText).trim() || "Hello!";
}
