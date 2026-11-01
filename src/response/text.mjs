import { extractContentText, getContentItems } from "./content.mjs";
import { isGeneratedImageOutput } from "./images/generated.mjs";
import { selectFallbackText } from "./outputs.mjs";

export function collectResponseText(outputs, response) {
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
