import { expect, jest, test } from "@jest/globals";
import { startApplication } from "../src/main.mjs";

const rootDir = process.cwd();
const logger = { warn: jest.fn() };

function makeDependencies(overrides = {}) {
  const client = { shutdown: jest.fn() };
  let signalHandlers;
  const createDiscord = jest.fn(async () => client);
  const dependencies = {
    createDiscord,
    initializeOpenAI: jest.fn(async () => ({ responses: {} })),
    log: logger,
    registerHandlers: jest.fn(),
    registerSignals: jest.fn((handlers) => {
      signalHandlers = handlers;
    }),
    rootDir,
    ...overrides,
  };
  return { dependencies, client, createDiscord, getSignalHandlers: () => signalHandlers };
}

test("starts the bot with its package version, intents, and runtime root", async () => {
  const { dependencies, client, createDiscord, getSignalHandlers } = makeDependencies();
  await expect(startApplication(dependencies)).resolves.toBe(client);

  expect(dependencies.registerHandlers).toHaveBeenCalledWith({ log: logger });
  expect(dependencies.initializeOpenAI).toHaveBeenCalledWith({ log: logger });
  expect(createDiscord).toHaveBeenCalledWith(
    expect.objectContaining({
      log: logger,
      rootDir,
      context: expect.objectContaining({ openai: { responses: {} } }),
      intents: expect.objectContaining({
        Guilds: true,
        GuildMessages: true,
        MessageContent: true,
        DirectMessages: true,
      }),
    }),
  );
  await getSignalHandlers().shutdownHook();
  await getSignalHandlers().shutdownHook();
  expect(client.shutdown).toHaveBeenCalledTimes(1);
});

test("skips Discord cleanup when no client was created", async () => {
  const { dependencies, getSignalHandlers } = makeDependencies({
    createDiscord: jest.fn(async () => null),
  });
  await startApplication(dependencies);
  await getSignalHandlers().shutdownHook();
  expect(logger.warn).not.toHaveBeenCalled();
});

test.each([
  [new Error("shutdown failed"), "shutdown failed"],
  [{}, "[object Object]"],
])("logs client shutdown failures", async (error, message) => {
  const client = { shutdown: jest.fn(async () => Promise.reject(error)) };
  const { dependencies, getSignalHandlers } = makeDependencies({
    createDiscord: jest.fn(async () => client),
  });
  await startApplication(dependencies);
  await getSignalHandlers().shutdownHook();
  expect(logger.warn).toHaveBeenCalledWith("Discord shutdown failed", { error: message });
});

test("does not connect when shutdown is requested during startup", async () => {
  const { dependencies, createDiscord, getSignalHandlers } = makeDependencies({
    initializeOpenAI: jest.fn(async () => {
      await getSignalHandlers().shutdownHook();
      return { responses: {} };
    }),
  });
  await expect(startApplication(dependencies)).resolves.toBeUndefined();
  expect(createDiscord).not.toHaveBeenCalled();
});
