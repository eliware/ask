import { jest, expect, test } from '@jest/globals';
import handler from '../../events/messageCreate.mjs';

test('messageCreate handler stub', async () => {
  const log = { debug: jest.fn(), info: jest.fn(), error: jest.fn(), warn: jest.fn() };
  const client = { user: { id: 'bot-id' } };
  const message = { id: 'message-id', author: { id: 'user-id' }, content: 'hello' };
  await expect(handler({ client, log, msg: jest.fn() }, message)).resolves.toBeUndefined();
});
