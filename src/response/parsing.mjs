import { normalizeOutputs } from "./outputs.mjs";
import { collectResponseText } from "./text.mjs";
import { collectResponseImages } from "./images/collection.mjs";

export function parseResponse(response) {
  const outputs = normalizeOutputs(response);
  return {
    replyText: collectResponseText(outputs, response),
    images: collectResponseImages(outputs),
  };
}
