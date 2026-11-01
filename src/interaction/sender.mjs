import { splitMessage } from "./splitting.mjs";

export function createMessageSender(message) {
  return async function send(response, ephemeral = false) {
    const content = response?.content ?? response;
    const files = response?.files || null;
    const chunks = await splitMessage(
      typeof content === "string" ? content : JSON.stringify(content),
      2000,
    );
    const target = ephemeral ? message.author : message;
    const sendOne = async (chunk, first) => {
      const payload = files && first ? { content: chunk, files } : chunk;
      if (target === message.author) return target.send(payload);
      if (first || !message.channel?.send) return message.reply(payload);
      return message.channel.send(payload);
    };
    for (let i = 0; i < chunks.length; i++) await sendOne(chunks[i], i === 0);
  };
}
