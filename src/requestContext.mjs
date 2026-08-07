export async function getRequestContext({ client, interaction, log }) {
  const context = {
    locale: interaction.locale || interaction.guild?.preferredLocale || 'en-US',
    query: interaction.options?.getString?.('query') || interaction.data?.options?.[0]?.value,
    userId: interaction.user?.id || interaction.member?.user?.id || null,
    userName: interaction.user?.username || interaction.member?.user?.username || null,
    channelId: interaction.channelId || interaction.channel?.id || null,
    channelName: interaction.channel?.name || null,
    guildId: interaction.guildId || interaction.guild?.id || null,
    guildName: interaction.guild?.name || null,
  };
  try {
    if ((!context.channelName || !context.guildName) && client && context.channelId) {
      const channel = await client.channels.fetch(context.channelId).catch(() => null);
      if (channel) { context.channelName ||= channel.name || null; context.guildName ||= channel.guild?.name || null; }
    }
    if (!context.guildName && client && context.guildId) {
      const guild = await client.guilds.fetch(context.guildId).catch(() => null);
      context.guildName ||= guild?.name || null;
    }
  } catch (error) { log.debug('Failed to enrich request context', { error: error?.message || String(error) }); }
  return context;
}
