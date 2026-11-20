import __contentModule from "./content.mjs";
const { extractContentText, getContentItems } = __contentModule;
import __generatedModule from "./images/generated.mjs";
const { isGeneratedImageOutput } = __generatedModule;
import __outputsModule from "./outputs.mjs";
const { selectFallbackText } = __outputsModule;

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
