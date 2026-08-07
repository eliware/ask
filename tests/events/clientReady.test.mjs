import { jest, expect, test } from '@jest/globals';
import handler from '../../events/clientReady.mjs';

test('clientReady handler stub', async () => {
  const log = { debug: jest.fn(), info: jest.fn(), error: jest.fn(), warn: jest.fn() };
  const client = { user: { tag: 'test#0001' } };
  await expect(handler({ log }, client)).resolves.toBeUndefined();
  expect(log.info).toHaveBeenCalled();
});
