import { readdirSync } from "node:fs";
import { join } from "node:path";
import { expect, jest, test } from "@jest/globals";
import { startApplication } from "../src/main.mjs";

const rootDir = process.cwd();
const logger = { warn: jest.fn() };

function makeDependencies(overrides = {}) {
  const client = { shutdown: jest.fn(), destroy: jest.fn() };
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

test("destroys clients without a shutdown method", async () => {
  const client = { destroy: jest.fn() };
  const { dependencies, getSignalHandlers } = makeDependencies({
    createDiscord: jest.fn(async () => client),
  });
  await startApplication(dependencies);
  await getSignalHandlers().shutdownHook();
  expect(client.destroy).toHaveBeenCalledTimes(1);
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

test("keeps runtime loader files available at the configured root", async () => {
  const commandFiles = readdirSync(join(rootDir, "commands")).filter((file) =>
    file.endsWith(".mjs"),
  );
  const eventFiles = readdirSync(join(rootDir, "events")).filter((file) => file.endsWith(".mjs"));
  expect(commandFiles.sort()).toEqual(["ask.mjs", "help.mjs"]);
  expect(eventFiles.sort()).toEqual([
    "clientReady.mjs",
    "debug.mjs",
    "error.mjs",
    "interactionCreate.mjs",
    "invalidated.mjs",
    "messageCreate.mjs",
    "warn.mjs",
  ]);
  for (const file of commandFiles) {
    const handler = await import(join(rootDir, "commands", file));
    expect(typeof handler.default).toBe("function");
  }
  for (const file of eventFiles) {
    const handler = await import(join(rootDir, "events", file));
    expect(typeof handler.default).toBe("function");
  }
});
