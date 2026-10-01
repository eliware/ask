import { createDiscord } from "@eliware/discord";
import { log, registerHandlers, registerSignals } from "@eliware/common";
import { initializeOpenAI } from "./src/openaiClient.mjs";
import { startApplication } from "./src/main.mjs";

await startApplication({
  createDiscord,
  initializeOpenAI,
  log,
  registerHandlers,
  registerSignals,
  rootDir: import.meta.dirname,
});
