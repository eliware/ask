export default function serializeMessageContent(response) {
  if (response?.files && response.content == null) return "";
  const content = response?.content ?? response;
  if (typeof content === "string") return content;
  const serialized = JSON.stringify(content);
  return serialized === undefined ? String(content) : serialized;
}
