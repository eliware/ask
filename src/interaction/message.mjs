import createMessageInteractionFactory from "./message/factory.mjs";

export default function createMessageInteraction(options) {
  return createMessageInteractionFactory(options);
}
