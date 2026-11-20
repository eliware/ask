export default function normalizeOutputs(response) {
  if (Array.isArray(response?.outputs)) return response.outputs;
  if (Array.isArray(response?.output)) return response.output;
  if (response?.outputs && typeof response.outputs === "object")
    return Object.values(response.outputs);
  if (response?.output && typeof response.output === "object")
    return Object.values(response.output);
  return [];
}
