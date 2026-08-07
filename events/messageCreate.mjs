import { safeSerialize } from '@eliware/common';
import { createMessageInteraction } from '../src/messageInteraction.mjs';

export default async function ({ client, log, msg, commandHandlers, ...contextData }, message) {
  log.debug('messageCreate', { id: message.id });
  if (message.author?.bot) return;
  const locale = message.guild?.preferredLocale || 'en-US';
  const localeMsg = (key, defaultMsg) => msg(locale, key, defaultMsg, log);
  if (message.content === '!help') { const response = localeMsg('help', 'This is the help text.'); await message.reply(response); log.debug('!help Response', { response }); return; }

  const isDirect = !message.guild;
  const isMentioned = message.mentions?.has?.(client.user) || false;
  let isReplyToBot = false;
  try {
    const referenceId = message.reference?.messageId || message.reference?.message?.id;
    if (referenceId) { const referencePromise = message.fetchReference ? message.fetchReference() : (message.channel?.messages?.fetch ? message.channel.messages.fetch(referenceId) : null); const reference = await Promise.resolve(referencePromise).catch(() => null); isReplyToBot = reference?.author?.id === client.user?.id; }
  } catch (error) { log.debug('failed to resolve referenced message', { error: safeSerialize(error) }); }
  if (!isDirect && !isMentioned && !isReplyToBot) return;

  const mentionPattern = new RegExp(`<@!?\\${client.user.id}>`, 'g');
  const text = (message.content || '').replace(isMentioned ? mentionPattern : /$^/, '').trim() || 'Hello!';
  const interaction = createMessageInteraction({ client, message, locale, text, log });
  try {
    let handler = commandHandlers?.ask;
    if (!handler) handler = (await import('../commands/ask.mjs')).default;
    if (handler) await handler({ client, log, msg: localeMsg, ...contextData }, interaction);
    else await interaction.reply({ content: localeMsg('help', 'Try /ask <anything>.'), flags: 1 << 6 });
  } catch (error) { log.error('messageCreate handler invocation failed', { error: safeSerialize(error), stack: error?.stack }); }
  finally { interaction.stopTyping(); }
}
