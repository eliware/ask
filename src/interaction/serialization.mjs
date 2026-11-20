export default function serializeMessageContent(response) {
  if (response?.files && response.content == null) return "";
  const content = response?.content ?? response;
  return typeof content === "string" ? content : JSON.stringify(content);
}
