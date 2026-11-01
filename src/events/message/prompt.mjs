const namePattern = /^\s*ask(?:\b\s*[,!:]?\s*|$)/i;
const mentionPattern = /<@!?[\w-]+>|<@&[\w-]+>|<#[\w-]+>/g;

export function extractMessagePrompt(content, addressedByName) {
  const addressedText = addressedByName ? content.replace(namePattern, "") : content;
  return addressedText.replace(mentionPattern, "").trim() || "Hello!";
}
