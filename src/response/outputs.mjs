export function normalizeOutputs(response) {
  if (Array.isArray(response?.outputs)) return response.outputs;
  if (Array.isArray(response?.output)) return response.output;
  if (response?.outputs && typeof response.outputs === "object")
    return Object.values(response.outputs);
  if (response?.output && typeof response.output === "object")
    return Object.values(response.output);
  return [];
}

export function getFallbackText(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  if (typeof value.text === "string") return value.text;
  if (typeof value.output_text === "string") return value.output_text;
  if (typeof value.content === "string") return value.content;
  return "";
}

export function selectFallbackText(replyText, response) {
  return replyText || getFallbackText(response?.output_text) || getFallbackText(response?.text);
}
