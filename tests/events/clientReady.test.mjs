import { jest, expect, test, describe } from '@jest/globals';
import handler from '../../events/clientReady.mjs';

describe('clientReady', () => {
  test('logs readiness without presence', async () => {
    const log = { debug: jest.fn(), info: jest.fn() };
    const client = { user: { tag: 'test#0001', setPresence: jest.fn() } };
    await expect(handler({ log }, client)).resolves.toBeUndefined();
    expect(log.debug).toHaveBeenCalledWith('ready', { tag: 'test#0001' });
    expect(log.info).toHaveBeenCalledWith('Logged in as test#0001');
    expect(client.user.setPresence).not.toHaveBeenCalled();
  });

  test('sets configured presence', async () => {
    const log = { debug: jest.fn(), info: jest.fn() };
    const client = { user: { tag: 'test#0001', setPresence: jest.fn() } };
    const presence = { status: 'online' };
    await handler({ log, presence }, client);
    expect(client.user.setPresence).toHaveBeenCalledWith(presence);
  });
});
