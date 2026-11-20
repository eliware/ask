export default async function enrichRequestContext(context, client, log) {
  try {
    if ((!context.channelName || !context.guildName) && client && context.channelId) {
      const channel = await client.channels.fetch(context.channelId).catch(() => null);
      if (channel) {
        context.channelName ||= channel.name || null;
        context.guildName ||= channel.guild?.name || null;
      }
    }
    if (!context.guildName && client && context.guildId) {
      const guild = await client.guilds.fetch(context.guildId).catch(() => null);
      context.guildName ||= guild?.name || null;
    }
  } catch (error) {
    log.debug("Failed to enrich request context", { error: error?.message || String(error) });
  }
  return context;
}
