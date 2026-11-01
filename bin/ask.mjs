#!/usr/bin/env node
import { join } from "node:path";
import { createDiscord } from "@eliware/discord";
import { log, registerHandlers, registerSignals } from "@eliware/common";
import { initializeOpenAI } from "../src/openai/client.mjs";
import { startApplication } from "../src/app/main.mjs";

await startApplication({
  createDiscord,
  initializeOpenAI,
  log,
  registerHandlers,
  registerSignals,
  rootDir: join(import.meta.dirname, ".."),
});
