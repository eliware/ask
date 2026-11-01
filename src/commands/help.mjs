// commands/help.mjs
export default async function ({ log, msg }, interaction) {
  log.debug("help Request", { interaction });
  const response = {
    content: msg("help", "Try /ask <anything> for answers, summaries, drafts, and images."),
    flags: 1 << 6, // EPHEMERAL
  };
  log.debug("help Response", { response });
  await interaction.reply(response);
}
