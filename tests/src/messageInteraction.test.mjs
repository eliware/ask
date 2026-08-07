import { createMessageInteraction } from '../../src/messageInteraction.mjs';

test('creates a message-backed interaction and sends replies', async () => {
  const replies = []; const message = { author: { send: async value => replies.push(value) }, reply: async value => replies.push(value), channel: { id: 'c', sendTyping: async () => {} } };
  const interaction = createMessageInteraction({ client: { user: { id: 'bot' } }, message, locale: 'en-US', text: 'hi', log: { error() {} } });
  await interaction.reply({ content: 'hello' });
  expect(replies).toEqual(['> hello']);
});
