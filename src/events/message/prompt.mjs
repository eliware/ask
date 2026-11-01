import { removeNameAddress } from "./addressing.mjs";

const mentionPattern = /<@!?[\w-]+>|<@&[\w-]+>|<#[\w-]+>/g;

export function extractMessagePrompt(content, addressedByName) {
  const addressedText = addressedByName ? removeNameAddress(content) : content;
  return addressedText.replace(mentionPattern, "").trim() || "Hello!";
}
