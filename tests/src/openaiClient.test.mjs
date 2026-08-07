import { jest } from "@jest/globals";
import { initializeOpenAI } from '../../src/openaiClient.mjs';

test('initializes and logs the OpenAI client', async () => {
  const log = { info: jest.fn(), error: jest.fn() };
  const client = { responses: {} };
  await expect(initializeOpenAI({ log, factory: async () => client })).resolves.toBe(client);
  expect(log.info).toHaveBeenCalledWith('OpenAI client initialized');
});

test('sanitizes initialization errors before logging', async () => {
  const log = { info: jest.fn(), error: jest.fn() };
  const error = new Error('failed');
  await expect(initializeOpenAI({ log, factory: async () => { throw error; } })).rejects.toBe(error);
  expect(log.error).toHaveBeenCalledWith('Failed to initialize OpenAI client', { error: expect.anything() });
});
test('supports missing logger methods', async () => {
  const client = await initializeOpenAI({ log: {}, factory: async () => ({ ok: true }) });
  expect(client).toEqual({ ok: true });
});
test('supports omitted logger on failure', async () => {
  await expect(initializeOpenAI({ factory: async () => { throw 'broken'; } })).rejects.toBe('broken');
});
