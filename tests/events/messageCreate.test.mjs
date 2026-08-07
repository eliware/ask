import { jest, expect, test, describe } from '@jest/globals';
jest.unstable_mockModule('../../commands/ask.mjs', () => ({ default: undefined }));
const { default: handler } = await import('../../events/messageCreate.mjs');

const makeLog = () => ({ debug: jest.fn(), info: jest.fn(), error: jest.fn(), warn: jest.fn() });
const makeClient = () => ({ user: { id: 'bot-id' } });
const makeMessage = (overrides = {}) => ({
  id: 'message-id', author: { id: 'user-id', send: jest.fn(async value => value) }, content: 'hello',
  reply: jest.fn(async value => value),
  channel: { sendTyping: jest.fn(async () => {}) },
  mentions: { has: jest.fn(() => false) }, ...overrides,
});

const run = (message, extra = {}) => {
  const log = extra.log || makeLog();
  const msg = extra.msg || jest.fn((locale, key, fallback) => `${locale}:${key}:${fallback}`);
  return handler({ client: makeClient(), log, msg, ...extra }, message).then(() => ({ log, msg }));
};

describe('messageCreate', () => {
  test('ignores bot authors', async () => {
    const log = makeLog();
    await run(makeMessage({ author: { bot: true } }), { log });
    expect(log.debug).toHaveBeenCalledWith('messageCreate', { id: 'message-id' });
  });

  test('replies to localized help', async () => {
    const message = makeMessage({ content: '!help', guild: { preferredLocale: 'fr' } });
    const { msg, log } = await run(message);
    expect(msg).toHaveBeenCalledWith('fr', 'help', 'This is the help text.', log);
    expect(message.reply).toHaveBeenCalledWith('fr:help:This is the help text.');
    expect(log.debug).toHaveBeenCalledWith('!help Response', { response: 'fr:help:This is the help text.' });
  });

  test('handles DM with supplied ask handler', async () => {
    const message = makeMessage({ guild: undefined, content: '' });
    const handlerMock = jest.fn(async (_ctx, interaction) => {
      expect(interaction.options.getString()).toBe('Hello!');
      await interaction.deferReply(); await interaction.reply({ content: 'answer' });
    });
    message.channel.sendTyping = jest.fn(async () => {});
    const { log } = await run(message, { commandHandlers: { ask: handlerMock } });
    expect(handlerMock).toHaveBeenCalled();
    expect(message.channel.sendTyping).toHaveBeenCalled();
    expect(log.error).not.toHaveBeenCalled();
  });

  test('handles mention, removes mention, and uses guild locale', async () => {
    const message = makeMessage({
      content: '<@!bot-id> please help', guild: { preferredLocale: 'de' },
      mentions: { has: jest.fn(() => true) },
    });
    const ask = jest.fn(async (_ctx, interaction) => expect(interaction.text).toBe('please help'));
    await run(message, { commandHandlers: { ask } });
    expect(ask).toHaveBeenCalled();
  });

  test('handles reply to bot through fetchReference', async () => {
    const message = makeMessage({
      reference: { messageId: 'ref-id' },
      fetchReference: jest.fn(async () => ({ author: { id: 'bot-id' } })),
    });
    const ask = jest.fn();
    await run(message, { commandHandlers: { ask } });
    expect(message.fetchReference).toHaveBeenCalled();
    expect(ask).toHaveBeenCalled();
  });

  test('handles legacy reference fetch and ignores unrelated messages', async () => {
    const fetch = jest.fn(async () => ({ author: { id: 'other' } }));
    const message = makeMessage({ reference: { message: { id: 'ref-id' } }, channel: { messages: { fetch } } });
    await run(message, { commandHandlers: { ask: jest.fn() } });
    expect(fetch).toHaveBeenCalledWith('ref-id');
    expect(message.reply).not.toHaveBeenCalled();
  });

  test('ignores reference lookup failures', async () => {
    const log = makeLog();
    const message = makeMessage({ reference: { messageId: 'ref-id' }, fetchReference: jest.fn(async () => { throw new Error('no access'); }) });
    await run(message, { log, commandHandlers: { ask: jest.fn() } });
    expect(log.debug).toHaveBeenCalledWith('messageCreate', { id: 'message-id' });
  });

  test('uses localized fallback when ask handler is absent', async () => {
    const message = makeMessage({ guild: undefined });
    await run(message, { commandHandlers: {} });
    expect(message.author.send).toHaveBeenCalledWith('> en-US:help:Try /ask <anything>.');
  });

  test('logs handler errors and still stops typing', async () => {
    const log = makeLog(); const error = new Error('boom');
    await run(makeMessage({ guild: undefined }), { log, commandHandlers: { ask: jest.fn(async () => { throw error; }) } });
    expect(log.error).toHaveBeenCalledWith('messageCreate handler invocation failed', expect.objectContaining({ stack: error.stack }));
  });

  test('ignores unrelated guild messages', async () => {
    const message = makeMessage({ guild: { preferredLocale: 'en-US' } });
    await run(message, { commandHandlers: { ask: jest.fn() } });
    expect(message.reply).not.toHaveBeenCalled();
  });

  test('handles referenced message when no fetch method exists', async () => {
    const message = makeMessage({ reference: { messageId: 'ref-id' }, channel: {} });
    await run(message, { commandHandlers: { ask: jest.fn() } });
    expect(message.reply).not.toHaveBeenCalled();
  });

  test('logs unexpected reference resolution errors', async () => {
    const log = makeLog();
    const message = makeMessage({ guild: { preferredLocale: 'en-US' } });
    Object.defineProperty(message, 'reference', { get: () => { throw new Error('bad reference'); } });
    await run(message, { log, commandHandlers: { ask: jest.fn() } });
    expect(log.debug).toHaveBeenCalledWith('failed to resolve referenced message', expect.objectContaining({ error: expect.anything() }));
    expect(message.reply).not.toHaveBeenCalled();
  });

});
