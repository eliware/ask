import enrichRequestContext from "./context-enrichment.mjs";

export default async function getRequestContext({ client, interaction, log }) {
  const context = {
    locale:
      interaction.locale ||
      interaction.guildLocale ||
      interaction.guild?.preferredLocale ||
      "en-US",
    query: interaction.options?.getString?.("query") || interaction.data?.options?.[0]?.value,
    userId: interaction.user?.id || interaction.member?.user?.id || null,
    userName: interaction.user?.username || interaction.member?.user?.username || null,
    channelId: interaction.channelId || interaction.channel?.id || null,
    channelName: interaction.channel?.name || null,
    guildId: interaction.guildId || interaction.guild?.id || null,
    guildName: interaction.guild?.name || null,
  };
  return enrichRequestContext(context, client, log);
}
