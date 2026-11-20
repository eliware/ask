export default async function deliverSlashFollowUps(interaction, chunks, log) {
  for (const chunk of chunks) {
    try {
      if (interaction.followUp) await interaction.followUp({ content: chunk });
      else await interaction.reply({ content: chunk });
    } catch (error) {
      log.debug("Failed to send follow-up chunk", { error: error?.message || String(error) });
    }
  }
}
