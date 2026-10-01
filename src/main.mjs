import { readFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";

export async function startApplication({
  createDiscord,
  initializeOpenAI,
  log,
  registerHandlers,
  registerSignals,
  rootDir,
}) {
  config({ path: join(rootDir, ".env"), quiet: true });
  registerHandlers({ log });

  let client;
  let shuttingDown = false;
  registerSignals({
    log,
    shutdownHook: async () => {
      if (shuttingDown) return;
      shuttingDown = true;
      try {
        if (client?.shutdown) await client.shutdown();
        else client?.destroy();
      } catch (error) {
        log.warn("Discord shutdown failed", { error: error?.message || String(error) });
      }
    },
  });

  const packageJson = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf8"));
  const presence = {
    activities: [{ name: `ask v${packageJson.version}`, type: 4 }],
    status: "online",
  };
  const openai = await initializeOpenAI({ log });
  if (shuttingDown) return undefined;

  client = await createDiscord({
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
  return client;
}
