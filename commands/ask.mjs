import { safeSerialize } from '@eliware/common';
import { getRequestContext } from '../src/requestContext.mjs';
import { buildConversationInput } from '../src/conversationHistory.mjs';
import { requestAnswer } from '../src/openaiRequest.mjs';
import { parseResponse } from '../src/responseParsing.mjs';
import { deliverResponse } from '../src/responseDelivery.mjs';
import { safetyMessage } from '../src/formatResponse.mjs';

function extractViolations(error) {
  if (Array.isArray(error?.error?.safety_violations)) return error.error.safety_violations.map(String);
  const match = String(error?.message || error || '').match(/safety_violations=\[([^\]]+)\]/i);
  return match ? match[1].split(',').map(value => value.trim()).filter(Boolean) : [];
}

export default async function ({ client, log, msg, openai }, interaction) {
  log.debug('ask Request', { interaction });
  const context = await getRequestContext({ client, interaction, log });
  if (!context.query) return interaction.reply({ content: msg('help', 'Please provide a query.'), flags: 1 << 6 });

  let deferred = false;
  try { await interaction.deferReply(); deferred = true; } catch (error) { log.debug('deferReply failed', { error: safeSerialize(error) }); }

  try {
    const input = await buildConversationInput({ client, interaction, channelId: context.channelId, query: context.query, locale: context.locale, log });
    const response = await requestAnswer(openai, input);
    const { replyText, images } = parseResponse(response);
    await deliverResponse(interaction, replyText, images, deferred, log);
  } catch (error) {
    log.error('ask handler error', { error: safeSerialize(error), stack: error?.stack });
    const violations = extractViolations(error);
    const message = safetyMessage(violations);
    try { if (deferred) await interaction.editReply({ content: message, flags: 1 << 6 }); else await interaction.reply({ content: message, flags: 1 << 6 }); } catch (replyError) { log.error('failed to send error response', { error: safeSerialize(replyError) }); }
  }
}
