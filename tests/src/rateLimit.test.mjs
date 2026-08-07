import { jest } from '@jest/globals';
import { checkRateLimit } from '../../src/rateLimit.mjs';

test('returns no violations when database is disabled', async () => {
  await expect(checkRateLimit(null, { userId: 'u' })).resolves.toEqual([]);
});

test('checks configured limits and skips missing scopes', async () => {
  const execute = jest.fn(async () => [[{ cnt: 50 }]]);

  await expect(checkRateLimit(execute && { execute }, { userId: 'u' })).resolves.toEqual([
    'Per-user hourly limit (50/hour) reached (50 in the last hour)',
  ]);
  expect(execute).toHaveBeenCalledTimes(2);
});

test('reports hourly and daily violations for every scope', async () => {
  const db = { execute: jest.fn(async () => [[{ cnt: 2 }]]) };

  await expect(checkRateLimit(db, { userId: 'u', channelId: 'c', guildId: 'g' }, { hourly: 2, daily: 2 })).resolves.toEqual([
    'Per-user hourly limit (2/hour) reached (2 in the last hour)',
    'Per-user daily limit (2/day) reached (2 in the last 24 hours)',
    'Per-channel hourly limit (2/hour) reached (2 in the last hour)',
    'Per-channel daily limit (2/day) reached (2 in the last 24 hours)',
    'Per-server hourly limit (2/hour) reached (2 in the last hour)',
    'Per-server daily limit (2/day) reached (2 in the last 24 hours)',
  ]);
  expect(db.execute).toHaveBeenCalledTimes(6);
});

test('treats missing count rows as zero', async () => {
  const db = { execute: jest.fn(async () => [[]]) };

  await expect(checkRateLimit(db, { userId: 'u' }, { hourly: 1, daily: 1 })).resolves.toEqual([]);
});
