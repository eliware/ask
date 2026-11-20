export default function serializeMessageContent(response) {
  const content = response?.content ?? response;
  return typeof content === "string" ? content : JSON.stringify(content);
}
