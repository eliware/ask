export function decodeBase64Image(value) {
  try {
    if (typeof value !== 'string' || !value || value.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) return null;
    return Buffer.from(value, 'base64');
  } catch { return null; }
}
export function normalizeOutputs(response) {
  if (Array.isArray(response?.outputs)) return response.outputs;
  if (Array.isArray(response?.output)) return response.output;
  if (response?.outputs && typeof response.outputs === 'object') return Object.values(response.outputs);
  if (response?.output && typeof response.output === 'object') return Object.values(response.output);
  return [];
}
export function parseResponse(response) {
  let replyText = ''; const images = [];
  for (const out of normalizeOutputs(response)) {
    if (out && (out.type === 'image_generation_call' || (out.id && String(out.id).startsWith('ig_'))) && typeof out.result === 'string') {
      const buffer = decodeBase64Image(out.result); if (buffer) images.push({ buffer, filename: `image_${out.id || Date.now()}.png`, mime: 'image/png', description: out.revised_prompt || null }); continue;
    }
    let contents = Array.isArray(out?.content) ? out.content : out?.content && typeof out.content === 'object' ? Object.values(out.content) : typeof out?.content === 'string' ? [out.content] : Array.isArray(out?.data) ? out.data : out?.data && typeof out.data === 'object' ? Object.values(out.data) : typeof out === 'string' ? [out] : [];
    for (const content of contents) {
      const text = typeof content === 'string' ? content : content?.text || content?.output_text || content?.content;
      if (typeof text === 'string' && text) replyText += (replyText ? '\n' : '') + text;
      const b64 = content?.b64_json || content?.base64 || content?.image?.b64 || content?.image?.b64_json || content?.image?.base64;
      if (typeof b64 === 'string' && b64) { const buffer = decodeBase64Image(b64); if (buffer) images.push({ buffer, filename: content?.filename || 'image.png', mime: content?.mime || 'image/png', description: content?.description || null }); continue; }
      const url = content?.image?.url || content?.url || content?.src || content?.href;
      if (typeof url === 'string' && url) images.push({ url, filename: content?.filename || 'image.png', description: content?.description || null });
    }
  }
  return { replyText: replyText || response?.output_text || response?.text || '', images };
}
