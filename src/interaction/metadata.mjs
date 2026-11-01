export function createMessageMetadata({ client, message, locale, text }) {
  return {
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
}
