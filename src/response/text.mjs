import __contentModule from "./content.mjs";
const { extractContentText, getContentItems } = __contentModule;
import isGeneratedImageOutput from "./images/generated/predicate.mjs";
import selectFallbackText from "./output/fallback.mjs";

export default function collectResponseText(outputs, response) {
  let text = "";
  for (const output of outputs) {
    if (isGeneratedImageOutput(output)) continue;
    for (const content of getContentItems(output)) {
      const contentText = extractContentText(content);
      if (contentText) text += (text ? "\n" : "") + contentText;
    }
  }
  return selectFallbackText(text, response);
}
