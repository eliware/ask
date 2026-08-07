import { jest, expect, test } from '@jest/globals';
import handler from '../../events/interactionCreate.mjs';

test('interactionCreate handler stub', async () => {
  const log = { debug: jest.fn(), info: jest.fn(), error: jest.fn(), warn: jest.fn() };
  const interaction = { commandName: 'missing', locale: 'en-US' };
  await expect(handler({ log, commandHandlers: {} }, interaction)).resolves.toBeUndefined();
});
