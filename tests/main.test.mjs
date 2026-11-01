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
    configureEnvironment: jest.fn(),
    environment: {
      DISCORD_CLIENT_ID: "test-client-id",
      DISCORD_TOKEN: "test-discord-token",
      OPENAI_API_KEY: "test-openai-key",
    },
    rootDir,
    ...overrides,
  };
  return { dependencies, client, createDiscord, getSignalHandlers: () => signalHandlers };
}

test("rejects missing configuration before registering or initializing services", async () => {
  const { dependencies, createDiscord } = makeDependencies({
    environment: { DISCORD_CLIENT_ID: "test-client-id", DISCORD_TOKEN: "test-discord-token" },
  });
  await expect(startApplication(dependencies)).rejects.toThrow(
    "Missing required environment values: OPENAI_API_KEY",
  );
  expect(dependencies.registerHandlers).not.toHaveBeenCalled();
  expect(dependencies.initializeOpenAI).not.toHaveBeenCalled();
  expect(createDiscord).not.toHaveBeenCalled();
});

test("uses default dotenv configuration and process environment", async () => {
  const names = ["DISCORD_CLIENT_ID", "DISCORD_TOKEN", "OPENAI_API_KEY"];
  const values = ["test-client-id", "test-discord-token", "test-openai-key"];
  const originalValues = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  const { dependencies, client, getSignalHandlers } = makeDependencies();
  delete dependencies.configureEnvironment;
  delete dependencies.environment;
  Object.assign(process.env, Object.fromEntries(names.map((name, index) => [name, values[index]])));
  try {
    await expect(startApplication(dependencies)).resolves.toBe(client);
    await getSignalHandlers().shutdownHook();
  } finally {
    for (const name of names) {
      if (originalValues[name] === undefined) delete process.env[name];
      else process.env[name] = originalValues[name];
    }
  }
});

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
  const { dependencies, getSignalHandlers } = makeDependencies({
    initializeOpenAI: jest.fn(async () => {
      await getSignalHandlers().shutdownHook();
      return { responses: {} };
    }),
  });
  const createDiscord = dependencies.createDiscord;
  await expect(startApplication(dependencies)).resolves.toBeUndefined();
  expect(createDiscord).not.toHaveBeenCalled();
});

test("shuts down a Discord client created after a stop signal", async () => {
  let resolveClient;
  const client = { shutdown: jest.fn() };
  const { dependencies, getSignalHandlers } = makeDependencies({
    createDiscord: jest.fn(
      () =>
        new Promise((resolve) => {
          resolveClient = resolve;
        }),
    ),
  });
  const createDiscord = dependencies.createDiscord;
  const startup = startApplication(dependencies);
  await Promise.resolve();
  expect(createDiscord).toHaveBeenCalled();
  await getSignalHandlers().shutdownHook();
  resolveClient(client);
  await expect(startup).resolves.toBeUndefined();
  expect(client.shutdown).toHaveBeenCalledTimes(1);
});
