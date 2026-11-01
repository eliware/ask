import { safeSerialize } from "@eliware/common";
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
  interaction.reply = async (response) => {
    typing.stop();
    try {
      await send(response, Boolean(response?.flags & (1 << 6)));
    } catch (error) {
      log.error("mock interaction.reply failed", { error: safeSerialize(error) });
    }
  };
  interaction.editReply = async (response) => {
    typing.stop();
    try {
      await send(response);
    } catch (error) {
      log.error("mock interaction.editReply failed", { error: safeSerialize(error) });
    }
  };
  interaction.stopTyping = typing.stop;
  return interaction;
}
