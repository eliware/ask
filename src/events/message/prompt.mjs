import __addressingModule from "./addressing.mjs";
const { removeNameAddress } = __addressingModule;

const mentionPattern = /<@!?[\w-]+>|<@&[\w-]+>|<#[\w-]+>/g;

export default function extractMessagePrompt(content, addressedByName) {
  const addressedText = addressedByName ? removeNameAddress(content) : content;
  return addressedText.replace(mentionPattern, "").trim() || "Hello!";
}
