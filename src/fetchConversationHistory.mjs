export async function fetchConversationHistory({ client, interaction, channelId, log }) {
  try {
    let fetched = interaction.channel?.messages?.fetch
      ? await interaction.channel.messages.fetch({ limit: 100 }).catch(() => null)
      : null;
    if (!fetched && client && channelId) {
      const channel = await client.channels.fetch(channelId).catch(() => null);
      fetched = channel?.messages?.fetch
        ? await channel.messages.fetch({ limit: 100 }).catch(() => null)
        : null;
    }
    if (!fetched?.values) return [];
    return Array.from(fetched.values())
      .reverse()
      .map((message) => {
        const text = String(message.content || "").trim();
        if (!text) return null;
        const role = message.author?.id === client?.user?.id ? "assistant" : "user";
        return {
          role,
          content: [{ type: role === "assistant" ? "output_text" : "input_text", text }],
        };
      })
      .filter(Boolean);
  } catch (error) {
    log.debug("Failed to fetch/attach channel history", { error: error?.message || String(error) });
    return [];
  }
}
