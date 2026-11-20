function getFallbackText(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  if (typeof value.text === "string") return value.text;
  if (typeof value.output_text === "string") return value.output_text;
  if (typeof value.content === "string") return value.content;
  return "";
}

export default function selectFallbackText(replyText, response) {
  return replyText || getFallbackText(response?.output_text) || getFallbackText(response?.text);
}
