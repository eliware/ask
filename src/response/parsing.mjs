import normalizeOutputs from "./output/normalize.mjs";
import collectResponseText from "./text.mjs";
import collectResponseImages from "./images/collection.mjs";

export default function parseResponse(response) {
  const outputs = normalizeOutputs(response);
  return {
    replyText: collectResponseText(outputs, response),
    images: collectResponseImages(outputs),
  };
}
