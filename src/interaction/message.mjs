import { createMessageReplyMethods } from "./reply-methods.mjs";
import { createMessageSender } from "./sender.mjs";
import { createTypingManager } from "./typing.mjs";

export function createMessageInteraction({ client, message, locale, text, log }) {
  const interaction = {
    commandName: "ask",
    locale,
    client,
    guild: message.guild || undefined,
    guildId: message.guild?.id || null,
    channelId: message.channel?.id || null,
    channel: message.channel,
    sourceMessageId: message.id,
    user: message.author,
    member: message.member || null,
    data: { options: [{ value: text }] },
    options: { getString: () => text },
    _omitBlockquote: true,
  };
  const send = createMessageSender(message);
  const typing = createTypingManager(message.channel);
  interaction.deferReply = typing.start;
  Object.assign(interaction, createMessageReplyMethods({ send, stopTyping: typing.stop, log }));
  interaction.stopTyping = typing.stop;
  return interaction;
}
