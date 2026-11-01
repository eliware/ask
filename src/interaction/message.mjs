import { createMessageInteractionFactory } from "./message/factory.mjs";

export function createMessageInteraction(options) {
  return createMessageInteractionFactory(options);
}
