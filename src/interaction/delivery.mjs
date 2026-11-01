export async function deliverMessageChunk(message, payload, ephemeral, first) {
  const target = ephemeral ? message.author : message;
  if (target === message.author) return target.send(payload);
  if (first || !message.channel?.send) return message.reply(payload);
  return message.channel.send(payload);
}
