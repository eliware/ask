import { createMessageReplyMethods } from "./reply-methods.mjs";
import { createMessageSender } from "./sender.mjs";
import { createTypingManager } from "./typing.mjs";
import { createMessageMetadata } from "./metadata.mjs";

export function createMessageInteraction({ client, message, locale, text, log }) {
  const interaction = createMessageMetadata({ client, message, locale, text });
  const send = createMessageSender(message);
  const typing = createTypingManager(message.channel);
  interaction.deferReply = typing.start;
  Object.assign(interaction, createMessageReplyMethods({ send, stopTyping: typing.stop, log }));
  interaction.stopTyping = typing.stop;
  return interaction;
}
