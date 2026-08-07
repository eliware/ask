import { buildConversationInput } from '../../src/conversationHistory.mjs';
test('builds system, history, and query input', async () => {
  const interaction = { channel: { messages: { fetch: async () => new Map([['1', { content: 'old', author: { id: 'u' } }]]) } } };
  const input = await buildConversationInput({ client: { user: { id: 'bot' } }, interaction, channelId: 'c', query: 'new', locale: 'en-US', log: { debug() {} } });
  expect(input).toHaveLength(3);
});
