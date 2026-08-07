import { jest, expect, test, describe } from '@jest/globals';
import handler from '../../events/interactionCreate.mjs';

describe('interactionCreate', () => {
  test('does nothing for missing command handler', async () => {
    const log = { debug: jest.fn(), info: jest.fn(), error: jest.fn(), warn: jest.fn() };

    await expect(handler({ log, commandHandlers: {} }, { commandName: 'missing', locale: 'en-US' }))
      .resolves.toBeUndefined();
  });

  test('uses interaction locale and invokes handler with localized msg', async () => {
    const log = { debug: jest.fn() };
    const msg = jest.fn();
    const commandHandler = jest.fn();
    const context = { client: { id: 'client' }, log, msg, commandHandlers: { ask: commandHandler }, extra: true };
    const interaction = { commandName: 'ask', locale: 'fr', guild: { preferredLocale: 'de' } };

    await handler(context, interaction);

    expect(commandHandler).toHaveBeenCalledTimes(1);
    const [handlerContext, receivedInteraction] = commandHandler.mock.calls[0];
    expect(handlerContext).toEqual(expect.objectContaining({ client: context.client, log, extra: true }));
    expect(handlerContext.msg).not.toBe(msg);
    expect(receivedInteraction).toBe(interaction);
    handlerContext.msg('key', 'Default');
    expect(msg).toHaveBeenCalledWith('fr', 'key', 'Default', log);
  });

  test('falls back to guild locale', async () => {
    const commandHandler = jest.fn();
    const msg = jest.fn();
    await handler({ msg, commandHandlers: { ask: commandHandler } }, {
      commandName: 'ask', locale: '', guild: { preferredLocale: 'es' },
    });

    commandHandler.mock.calls[0][0].msg('key', 'Default');
    expect(msg).toHaveBeenCalledWith('es', 'key', 'Default', undefined);
  });

  test('falls back to English when no locale is available', async () => {
    const commandHandler = jest.fn();
    const msg = jest.fn();
    await handler({ msg, commandHandlers: { ask: commandHandler } }, { commandName: 'ask', locale: '', guild: {} });

    commandHandler.mock.calls[0][0].msg('key', 'Default');
    expect(msg).toHaveBeenCalledWith('en-US', 'key', 'Default', undefined);
  });

  test('supports omitted command handlers', async () => {
    await expect(handler({ msg: jest.fn() }, { commandName: 'missing' })).resolves.toBeUndefined();
  });
});
