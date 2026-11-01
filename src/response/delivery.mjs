import { defaultSplit, splitBlockquoted } from "./formatting.mjs";
import { deliverMessageResponse } from "./message-delivery.mjs";
export async function deliverResponse(interaction, replyText, images, deferred, log) {
  const text = typeof replyText === "string" ? replyText.trim() : "";
  const files = images
    .filter((image) => image.buffer)
    .map((image) => ({ attachment: image.buffer, name: image.filename }));
  const urls = images.filter((image) => image.url).map((image) => image.url);
  if (interaction._omitBlockquote)
    return deliverMessageResponse(interaction, text, files, urls, deferred);
  const chunks = [
    ...(text ? splitBlockquoted(text, 2000) : []),
    ...urls.flatMap((url) => defaultSplit(url, 2000)),
  ];
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
  const message = {};
  if (files.length) message.files = files;
  if (!message.files && !message.content) message.content = "Sorry, I could not create a reply.";
  return deferred ? interaction.editReply(message) : interaction.reply(message);
}
