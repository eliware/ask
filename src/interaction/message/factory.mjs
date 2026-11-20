import createMessageReplyMethods from "../reply-methods.mjs";
import createMessageSender from "../sender.mjs";
import setupMessageTyping from "./typing.mjs";
import createMessageMetadata from "../metadata.mjs";

export default function createMessageInteractionFactory({ client, message, locale, text, log }) {
  const interaction = createMessageMetadata({ client, message, locale, text });
  const send = createMessageSender(message);
  const stopTyping = setupMessageTyping(interaction, message.channel);
  Object.assign(interaction, createMessageReplyMethods({ send, stopTyping, log }));
  return interaction;
}
