import { readFileSync } from "node:fs";
import { join } from "node:path";
import { validateConfiguration } from "../configuration/validate.mjs";
import { loadEnvironment } from "../configuration/environment.mjs";
import { createPresence } from "./presence.mjs";
import { createShutdownManager } from "./shutdown.mjs";

export async function startApplication({
  createDiscord,
  initializeOpenAI,
  log,
  registerHandlers,
  registerSignals,
  rootDir,
  createHealthServer,
  environment = process.env,
}) {
  loadEnvironment(rootDir);
  validateConfiguration(environment);
  const healthServer = createHealthServer?.({
    host: environment.HEALTH_HOST || "127.0.0.1",
  });
  const shutdown = createShutdownManager({ log, healthServer });

  try {
    registerSignals({ log, shutdownHook: shutdown.shutdownHook });
    if (shutdown.isShuttingDown()) return undefined;
    await healthServer?.start();
    if (shutdown.isShuttingDown()) {
      await shutdown.shutdownHealthServer();
      return undefined;
    }
    registerHandlers({ log });
    if (shutdown.isShuttingDown()) return undefined;

    const packageJson = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf8"));
    const presence = createPresence(packageJson.version);
    const openai = await initializeOpenAI({ log });
    if (shutdown.isShuttingDown()) return undefined;

    const createdClient = await createDiscord({
      log,
      rootDir,
      context: {
        presence,
        version: packageJson.version,
        openai,
        healthServer,
      },
      intents: {
        Guilds: true,
        GuildMessages: true,
        MessageContent: true,
        DirectMessages: true,
        GuildMembers: false,
        GuildPresences: false,
        GuildVoiceStates: false,
        GuildScheduledEvents: false,
        GuildModeration: false,
        GuildExpressions: false,
        GuildIntegrations: false,
        GuildWebhooks: false,
        GuildInvites: false,
        GuildMessageReactions: false,
        GuildMessageTyping: false,
        DirectMessageReactions: false,
        DirectMessageTyping: false,
        AutoModerationConfiguration: false,
        AutoModerationExecution: false,
        GuildMessagePolls: false,
        DirectMessagePolls: false,
      },
    });
    if (shutdown.isShuttingDown()) {
      await shutdown.shutdownClient(createdClient);
      await shutdown.shutdownHealthServer();
      return undefined;
    }
    shutdown.setClient(createdClient);
    return createdClient;
  } catch (error) {
    await shutdown.shutdownClient();
    await shutdown.shutdownHealthServer();
    throw error;
  }
}
