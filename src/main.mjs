import { readFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";
import { validateConfiguration } from "./configuration.mjs";

export async function startApplication({
  createDiscord,
  initializeOpenAI,
  log,
  registerHandlers,
  registerSignals,
  rootDir,
  configureEnvironment = config,
  environment = process.env,
}) {
  configureEnvironment({ path: join(rootDir, ".env"), quiet: true });
  validateConfiguration(environment);
  registerHandlers({ log });

  let client;
  let shuttingDown = false;
  const shutdownClient = async (target) => {
    try {
      if (target) await target.shutdown();
    } catch (error) {
      log.warn("Discord shutdown failed", { error: error?.message || String(error) });
    }
  };
  registerSignals({
    log,
    shutdownHook: async () => {
      if (shuttingDown) return;
      shuttingDown = true;
      await shutdownClient(client);
    },
  });

  const packageJson = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf8"));
  const presence = {
    activities: [{ name: `ask v${packageJson.version}`, type: 4 }],
    status: "online",
  };
  const openai = await initializeOpenAI({ log });
  if (shuttingDown) return undefined;

  const createdClient = await createDiscord({
    log,
    rootDir,
    context: {
      presence,
      version: packageJson.version,
      openai,
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
  if (shuttingDown) {
    await shutdownClient(createdClient);
    return undefined;
  }
  client = createdClient;
  return client;
}
