import createSlashChunks from "./chunks.mjs";
import createSlashFallback from "./fallback.mjs";
import deliverSlashFollowUps from "./follow-up.mjs";

export default async function deliverSlashResponse(interaction, text, files, urls, deferred, log) {
  const chunks = createSlashChunks(text, urls);
  if (chunks.length) {
    const first = { content: chunks[0] };
    if (files.length) first.files = files;
    if (deferred) await interaction.editReply(first);
    else await interaction.reply(first);
    await deliverSlashFollowUps(interaction, chunks.slice(1), log);
    return;
  }
  const message = createSlashFallback(files);
  return deferred ? interaction.editReply(message) : interaction.reply(message);
}
