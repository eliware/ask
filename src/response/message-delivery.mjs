export function deliverMessageResponse(interaction, text, files, urls, deferred) {
  const message = {};
  if (text) message.content = text;
  if (files.length) message.files = files;
  if (urls.length)
    message.content = `${message.content ? `${message.content}\n\n` : ""}${urls.join("\n")}`;
  return deferred ? interaction.editReply(message) : interaction.reply(message);
}
