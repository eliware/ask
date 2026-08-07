import { jest } from '@jest/globals';
import { insertUsage, saveImages, saveSuccess, saveError } from '../../src/usageStore.mjs';

const context = { userId: 'u', userName: 'n', channelId: 'c', channelName: 'cn', guildId: 'g', guildName: 'gn', query: 'q' };

function logger() {
  return { debug: jest.fn(), error: jest.fn() };
}

test('insertUsage skips missing db and persists a pre-call row', async () => {
  expect(await insertUsage(null, context, logger())).toBeNull();
  const log = logger();
  const db = { execute: jest.fn().mockResolvedValue([{ insertId: 7 }]) };
  expect(await insertUsage(db, context, log)).toBe(7);
  expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO'), Object.values(context));
  expect(log.debug).toHaveBeenCalledWith('Inserted usage pre-record', { usageId: 7 });
});

test('insertUsage logs database failures', async () => {
  const log = logger();
  const db = { execute: jest.fn().mockRejectedValue(new Error('nope')) };
  expect(await insertUsage(db, context, log)).toBeNull();
  expect(log.error).toHaveBeenCalledWith('Failed to insert pre-call usage record', { error: 'nope' });

  const stringErrorLog = logger();
  expect(await insertUsage({ execute: jest.fn().mockRejectedValue(null) }, context, stringErrorLog)).toBeNull();
  expect(stringErrorLog.error).toHaveBeenCalledWith(expect.any(String), { error: 'null' });
});

test('saveImages skips, filters, and stores images', async () => {
  const log = logger();
  await saveImages(null, 1, [], log);
  await saveImages({}, null, [], log);
  const db = { execute: jest.fn().mockResolvedValue([]) };
  await saveImages(db, 2, [{ description: 'd' }, { buffer: Buffer.from('x'), filename: 'x.png', mime: 'image/png' }, { buffer: Buffer.from('y') }], log);
  expect(db.execute).toHaveBeenCalledTimes(2);
  expect(db.execute.mock.calls[0][1]).toEqual([2, 'x.png', 'image/png', expect.any(Buffer), JSON.stringify({ mime: 'image/png' })]);
  expect(db.execute.mock.calls[1][1].slice(1, 3)).toEqual([null, null]);
});

test('saveImages logs serialization/database failures', async () => {
  const log = logger();
  const circular = {}; circular.self = circular;
  await saveImages({ execute: jest.fn() }, 1, [{ buffer: Buffer.from('x'), description: circular }], log);
  expect(log.error).toHaveBeenCalled();
  const dbLog = logger();
  await saveImages({ execute: jest.fn().mockRejectedValue(new Error('write')) }, 1, [{ buffer: Buffer.from('x') }], dbLog);
  expect(dbLog.error).toHaveBeenCalledWith('Failed to write images to usage_images', { error: 'write' });
});

test('saveSuccess handles optional fields and writes complete metadata', async () => {
  await saveSuccess(null, 1, {}, 'x', 1, [], logger());
  await saveSuccess({}, null, {}, 'x', 1, [], logger());
  const db = { execute: jest.fn().mockResolvedValue([]) };
  const response = { id: 'r', model: 'gpt-4o-mini', completed_at: 1, status: 'completed', service_tier: 'default', usage: { total_tokens: 3, input_tokens: 1, output_tokens: 2 } };
  await saveSuccess(db, 9, response, 'ok', 12, [], logger());
  const args = db.execute.mock.calls[0][1];
  expect(args.slice(0, 10)).toEqual(['ok', 'gpt', 'gpt-4o-mini', 3, 1, 2, 3, 12, '1970-01-01 00:00:01', 'r']);
  expect(args.slice(-4)).toEqual([expect.any(String), 'completed', 'default', 9]);
});

test('saveSuccess logs failures', async () => {
  const log = logger();
  await saveSuccess({ execute: jest.fn().mockRejectedValue(new Error('update')) }, 1, {}, 'x', 1, [], log);
  expect(log.error).toHaveBeenCalledWith('Failed to update usage record after success', { error: 'update' });
});

test('saveError skips, persists, and logs failures', async () => {
  await saveError(null, 1, 'x', [], new Error('e'), logger());
  await saveError({}, null, 'x', [], new Error('e'), logger());
  const db = { execute: jest.fn().mockResolvedValue([]) };
  await saveError(db, 4, 'bad', ['a', 'b'], { reason: 'x' }, logger());
  expect(db.execute.mock.calls[0][1]).toEqual(['bad', 'a,b', expect.any(String), 4]);
  const log = logger();
  await saveError({ execute: jest.fn().mockRejectedValue(new Error('err')) }, 4, 'bad', [], {}, log);
  expect(log.error).toHaveBeenCalledWith('Failed to update usage record after error', { error: 'err' });
});
