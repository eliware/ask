import { jest } from "@jest/globals";
import { createMessageInteraction } from '../../src/messageInteraction.mjs';

const log = () => ({ error: jest.fn() });

test('creates a message-backed interaction and sends replies', async () => {
  const replies = [];
  const message = { author: { send: async value => replies.push(value) }, reply: async value => replies.push(value), channel: { id: 'c', sendTyping: async () => {} } };
  const interaction = createMessageInteraction({ client: { user: { id: 'bot' } }, message, locale: 'en-US', text: 'hi', log: log() });
  await interaction.reply({ content: 'hello' });
  expect(replies).toEqual(['> hello']);
  expect(interaction.guild).toBeUndefined();
  expect(interaction.guildId).toBeNull();
  expect(interaction.channelId).toBe('c');
  expect(interaction.options.getString()).toBe('hi');
});

test('exposes message metadata and handles objects, files, and ephemeral replies', async () => {
  const sent = []; const replied = [];
  const message = {
    guild: { id: 'g' }, author: { id: 'u', send: async value => sent.push(value) }, member: { id: 'm' },
    channel: { id: 'c' }, reply: async value => replied.push(value),
  };
  const interaction = createMessageInteraction({ client: {}, message, locale: 'fr', text: 'question', log: log() });
  await interaction.editReply({ content: { answer: 1 }, files: ['file'] });
  await interaction.reply({ content: 'private', flags: 1 << 6 });
  await interaction.editReply({ content: 'x'.repeat(2100), files: ['second'] });
  expect(replied[0]).toEqual({ content: '> {"answer":1}', files: ['file'] });
  expect(replied[1]).toHaveProperty('files', ['second']);
  expect(replied).toHaveLength(3);
  expect(sent).toEqual(['> private']);
  expect(interaction.guildId).toBe('g');
  expect(interaction.user).toBe(message.author);
  expect(interaction.member).toBe(message.member);
});

test('deferReply starts and refreshes typing, including failures', async () => {
  jest.useFakeTimers();
  const typing = jest.fn()
    .mockRejectedValueOnce(new Error('initial'))
    .mockImplementation(() => { throw new Error('refresh'); });
  const message = { author: {}, channel: { sendTyping: typing } };
  const interaction = createMessageInteraction({ client: {}, message, locale: 'en', text: '', log: log() });
  await interaction.deferReply();
  jest.advanceTimersByTime(8000);
  await Promise.resolve();
  interaction.stopTyping();
  expect(typing).toHaveBeenCalled();
  jest.useRealTimers();

  const noChannel = createMessageInteraction({ client: {}, message: { author: {} }, locale: 'en', text: '', log: log() });
  await noChannel.deferReply();
});

test('logs reply and edit failures', async () => {
  const logger = log();
  const message = { author: { send: async () => { throw new Error('send'); } }, reply: async () => { throw new Error('reply'); } };
  const interaction = createMessageInteraction({ client: {}, message, locale: 'en', text: 'x', log: logger });
  await interaction.reply('bad');
  await interaction.editReply('bad');
  expect(logger.error).toHaveBeenCalledTimes(2);
});

test('falls back to default splitting when discord splitter is unavailable', async () => {
  jest.resetModules();
  jest.unstable_mockModule('@eliware/discord', () => ({}));
  const { createMessageInteraction: createFallbackInteraction } = await import('../../src/messageInteraction.mjs');
  const replies = [];
  const message = { author: {}, reply: async value => replies.push(value) };
  const interaction = createFallbackInteraction({ client: {}, message, locale: 'en', text: 'x', log: log() });
  await interaction.editReply('y'.repeat(2100));
  expect(replies).toHaveLength(2);
});
