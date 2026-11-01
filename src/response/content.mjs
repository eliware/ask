export function getContentItems(output) {
  if (Array.isArray(output?.content)) return output.content;
  if (output?.content && typeof output.content === "object") return Object.values(output.content);
  if (typeof output?.content === "string") return [output.content];
  if (Array.isArray(output?.data)) return output.data;
  if (output?.data && typeof output.data === "object") return Object.values(output.data);
  if (typeof output === "string") return [output];
  return [];
}

export function extractContentText(content) {
  const text =
    typeof content === "string"
      ? content
      : content?.text || content?.output_text || content?.content;
  return typeof text === "string" ? text : "";
}
