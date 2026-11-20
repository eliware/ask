import createSlashChunks from "./chunks.mjs";
import createSlashFallback from "./fallback.mjs";

export default async function deliverSlashResponse(interaction, text, files, urls, deferred, log) {
  const chunks = createSlashChunks(text, urls);
  if (chunks.length) {
    const first = { content: chunks[0] };
    if (files.length) first.files = files;
    if (deferred) await interaction.editReply(first);
    else await interaction.reply(first);
    for (const chunk of chunks.slice(1)) {
      try {
        if (interaction.followUp) await interaction.followUp({ content: chunk });
        else await interaction.reply({ content: chunk });
      } catch (error) {
        log.debug("Failed to send follow-up chunk", { error: error?.message || String(error) });
      }
    }
    return;
  }
  const message = createSlashFallback(files);
  return deferred ? interaction.editReply(message) : interaction.reply(message);
}
