import { jest } from '@jest/globals';
import { getRequestContext } from '../../src/requestContext.mjs';

test('builds context from interaction fields', async () => {
  const context = await getRequestContext({
    client: null,
    interaction: {
      locale: 'en-US',
      options: { getString: () => 'hi' },
      user: { id: 'u', username: 'User' },
      channelId: 'c',
      channel: { name: 'channel' },
      guildId: 'g',
      guild: { name: 'guild' },
    },
    log: { debug() {} },
  });
  expect(context).toEqual({
    locale: 'en-US', query: 'hi', userId: 'u', userName: 'User',
    channelId: 'c', channelName: 'channel', guildId: 'g', guildName: 'guild',
  });
});

test('uses fallbacks and data options', async () => {
  const context = await getRequestContext({
    client: null,
    interaction: {
      guild: { preferredLocale: 'fr', id: 'g' },
      data: { options: [{ value: 'data query' }] },
      member: { user: { id: 'member', username: 'Member' } },
      channel: { id: 'channel' },
    },
    log: { debug() {} },
  });
  expect(context).toMatchObject({
    locale: 'fr', query: 'data query', userId: 'member', userName: 'Member',
    channelId: 'channel', guildId: 'g',
  });
});

test('uses default and null values when fields are absent', async () => {
  const context = await getRequestContext({ client: null, interaction: {}, log: { debug() {} } });
  expect(context).toEqual({
    locale: 'en-US', query: undefined, userId: null, userName: null,
    channelId: null, channelName: null, guildId: null, guildName: null,
  });
});

test('enriches missing names from channel and guild', async () => {
  const fetchChannel = jest.fn().mockResolvedValue({ name: 'fetched channel', guild: { name: 'fetched guild' } });
  const context = await getRequestContext({
    client: { channels: { fetch: fetchChannel }, guilds: { fetch: jest.fn() } },
    interaction: { channelId: 'c', guildId: 'g' },
    log: { debug() {} },
  });
  expect(fetchChannel).toHaveBeenCalledWith('c');
  expect(context).toMatchObject({ channelName: 'fetched channel', guildName: 'fetched guild' });
});

test('fetches guild when channel does not provide one', async () => {
  const fetchGuild = jest.fn().mockResolvedValue({ name: 'fetched guild' });
  const context = await getRequestContext({
    client: { channels: { fetch: jest.fn().mockResolvedValue(null) }, guilds: { fetch: fetchGuild } },
    interaction: { channelId: 'c', guildId: 'g' },
    log: { debug() {} },
  });
  expect(fetchGuild).toHaveBeenCalledWith('g');
  expect(context.guildName).toBe('fetched guild');
});

test('continues when enrichment fetches fail', async () => {
  const debug = jest.fn();
  const context = await getRequestContext({
    client: {
      channels: { fetch: jest.fn().mockRejectedValue(new Error('channel failed')) },
      guilds: { fetch: jest.fn().mockRejectedValue('guild failed') },
    },
    interaction: { channelId: 'c', guildId: 'g' },
    log: { debug },
  });
  expect(context.channelName).toBeNull();
  expect(context.guildName).toBeNull();
  expect(debug).not.toHaveBeenCalled();
});

test('logs unexpected enrichment failures', async () => {
  const debug = jest.fn();
  const context = await getRequestContext({
    client: { channels: { fetch: () => ({ catch: () => { throw new Error('broken catch'); } }) } },
    interaction: { channelId: 'c' },
    log: { debug },
  });
  expect(context.channelName).toBeNull();
  expect(debug).toHaveBeenCalledWith('Failed to enrich request context', { error: 'broken catch' });
});
test('covers channel and guild name fallback branches', async () => {
  const context = await getRequestContext({
    client: { channels: { fetch: async () => ({ name: 'chan', guild: { name: 'guild' } }) }, guilds: { fetch: async () => ({ name: 'other' }) } },
    interaction: { options: { getString: () => 'q' }, channelId: 'c', guildId: 'g' }, log: { debug() {} },
  });
  expect(context.channelName).toBe('chan');
  expect(context.guildName).toBe('guild');
  const guildOnly = await getRequestContext({ client: { channels: { fetch: async () => ({}) }, guilds: { fetch: async () => ({ name: 'guild' }) } }, interaction: { options: { getString: () => 'q' }, channelId: 'c', guildId: 'g' }, log: { debug() {} } });
  expect(guildOnly.guildName).toBe('guild');
});
test('stringifies enrichment errors without messages', async () => {
  const debug = jest.fn();
  const client = {}; Object.defineProperty(client, 'channels', { get: () => { throw 'broken'; } });
  await getRequestContext({ client, interaction: { options: { getString: () => 'q' }, channelId: 'c' }, log: { debug } });
  expect(debug).toHaveBeenCalledWith('Failed to enrich request context', { error: 'broken' });
});
