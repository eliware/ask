import { safeSerialize } from '@eliware/common';
import { addBlockquote, defaultSplit } from './formatResponse.mjs';

async function splitText(text, max) {
  try { const mod = await import('@eliware/discord'); if (typeof mod.splitMsg === 'function') return mod.splitMsg(text, max); } catch {}
  return defaultSplit(text, max);
}

export function createMessageInteraction({ client, message, locale, text, log }) {
  const interaction = {
    commandName: 'ask', locale, client,
    guild: message.guild || undefined, guildId: message.guild?.id || null,
    channelId: message.channel?.id || null, channel: message.channel,
    user: message.author, member: message.member || null,
    data: { options: [{ value: text }] },
    options: { getString: () => text },
    _omitBlockquote: true,
  };
  const stopTyping = () => { if (interaction._typingInterval) { clearInterval(interaction._typingInterval); interaction._typingInterval = null; } };
  const send = async (response, ephemeral = false) => {
    const content = response?.content ?? response;
    const files = response?.files || null;
    const chunks = await splitText(addBlockquote(typeof content === 'string' ? content : JSON.stringify(content)), 2000);
    const target = ephemeral ? message.author : message;
    const sendOne = async (chunk, first) => {
      const payload = files && first ? { content: chunk, files } : chunk;
      return target === message.author ? target.send(payload) : target.reply(payload);
    };
    for (let i = 0; i < chunks.length; i++) await sendOne(chunks[i], i === 0);
  };
  interaction.deferReply = async () => {
    try { await message.channel?.sendTyping?.(); } catch {}
    if (message.channel?.sendTyping && !interaction._typingInterval) interaction._typingInterval = setInterval(() => { try { message.channel.sendTyping(); } catch {} }, 8000);
  };
  interaction.reply = async response => { stopTyping(); try { await send(response, Boolean(response?.flags & (1 << 6))); } catch (error) { log.error('mock interaction.reply failed', { error: safeSerialize(error) }); } };
  interaction.editReply = async response => { stopTyping(); try { await send(response); } catch (error) { log.error('mock interaction.editReply failed', { error: safeSerialize(error) }); } };
  interaction.stopTyping = stopTyping;
  return interaction;
}
