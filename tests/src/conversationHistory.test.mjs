import { jest } from "@jest/globals";
import { buildConversationInput } from '../../src/conversationHistory.mjs';

const log = { debug: jest.fn() };

beforeEach(() => log.debug.mockClear());

test('builds system, channel history, and query input', async () => {
  const interaction = {
    channel: {
      messages: {
        fetch: jest.fn(async () => new Map([
          ['1', { content: 'assistant reply', author: { id: 'bot' } }],
          ['2', { content: '   ', author: { id: 'user' } }],
          ['3', { content: 'user question', author: { id: 'user' } }],
        ])),
      },
    },
  };
  const input = await buildConversationInput({
    client: { user: { id: 'bot' } }, interaction, channelId: 'c', query: 'new', locale: 'en-US', log,
  });

  expect(input).toEqual([
    input[0],
    { role: 'user', content: [{ type: 'input_text', text: 'user question' }] },
    { role: 'assistant', content: [{ type: 'output_text', text: 'assistant reply' }] },
    { role: 'user', content: [{ type: 'input_text', text: 'new' }] },
  ]);
  expect(input[0].content[0].text).toContain('en-US');
});

test('fetches history from the client when interaction has no fetcher', async () => {
  const fetch = jest.fn(async () => new Map([['1', { content: 'from client', author: {} }]]));
  const interaction = { channel: { messages: {} } };
  const input = await buildConversationInput({
    client: { user: { id: 'bot' }, channels: { fetch: jest.fn(async () => ({ messages: { fetch } })) } },
    interaction, channelId: 'channel', query: 'query', locale: 'en', log,
  });

  expect(fetch).toHaveBeenCalledWith({ limit: 100 });
  expect(input.at(-2).content[0].text).toBe('from client');
});

test('handles failed fetches and unavailable channels', async () => {
  const input1 = await buildConversationInput({
    interaction: { channel: { messages: { fetch: jest.fn(async () => { throw new Error('no access'); }) } } },
    query: 'q', locale: 'en', log,
  });
  expect(input1.at(-1).content[0].text).toBe('q');
  expect(log.debug).not.toHaveBeenCalled();

  const input2 = await buildConversationInput({
    interaction: {}, client: {}, channelId: '', query: 'q2', locale: 'en', log,
  });
  expect(input2).toHaveLength(2);
});

test('logs unexpected history errors and handles empty message content', async () => {
  const interaction = {};
  Object.defineProperty(interaction, 'channel', { get: () => { throw new Error('broken channel'); } });
  const input = await buildConversationInput({ interaction, query: 'q', locale: 'en', log });

  expect(input).toHaveLength(2);
  expect(log.debug).toHaveBeenCalledWith('Failed to fetch/attach channel history', { error: 'broken channel' });

  const oddInteraction = {};
  Object.defineProperty(oddInteraction, 'channel', { get: () => { throw 'broken'; } });
  await buildConversationInput({ interaction: oddInteraction, query: 'q', locale: 'en', log });
  expect(log.debug).toHaveBeenCalledWith('Failed to fetch/attach channel history', { error: 'broken' });

  const messages = new Map([['1', { author: {} }], ['2', { content: 'kept', author: {} }]]);
  const result = await buildConversationInput({
    interaction: { channel: { messages: { fetch: async () => messages } } },
    query: 'q2', locale: 'en', log,
  });
  expect(result.at(-2).content[0].text).toBe('kept');
});

test('continues when client or channel fetch rejects', async () => {
  const input = await buildConversationInput({
    interaction: { channel: { messages: {} } },
    client: { channels: { fetch: jest.fn(async () => { throw new Error('missing'); }) } },
    channelId: 'missing', query: 'q', locale: 'en', log,
  });
  expect(input).toHaveLength(2);
});

test('handles fetch results without iterable history and missing channel API', async () => {
  const noHistory = await buildConversationInput({
    interaction: { channel: { messages: { fetch: jest.fn(async () => ({})) } } },
    query: 'q', locale: 'en', log,
  });
  expect(noHistory).toHaveLength(2);

  const noChannelApi = await buildConversationInput({
    interaction: {}, client: { channels: {} }, channelId: 'channel', query: 'q2', locale: 'en', log,
  });
  expect(noChannelApi).toHaveLength(2);
});

test('falls back when interaction fetch returns null and client channel has no fetcher', async () => {
  const channelFetch = jest.fn(async () => ({}));
  const input = await buildConversationInput({
    interaction: { channel: { messages: { fetch: jest.fn(async () => null) } } },
    client: { channels: { fetch: jest.fn(async () => ({ messages: { fetch: channelFetch } })) } },
    channelId: 'channel', query: 'q', locale: 'en', log,
  });
  expect(channelFetch).toHaveBeenCalledWith({ limit: 100 });
  expect(input).toHaveLength(2);
});

test('handles rejected client channel history fetch', async () => {
  const input = await buildConversationInput({
    interaction: { channel: { messages: {} } },
    client: {
      channels: {
        fetch: jest.fn(async () => ({
          messages: { fetch: jest.fn(async () => { throw new Error('history unavailable'); }) },
        })),
      },
    },
    channelId: 'channel', query: 'q', locale: 'en', log,
  });

  expect(input).toHaveLength(2);
  expect(log.debug).not.toHaveBeenCalled();
});
