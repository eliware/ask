#!/usr/bin/env node
import { join } from "node:path";
import { createDiscord } from "@eliware/discord";
import { log, registerHandlers, registerSignals } from "@eliware/common";
import { createHealthServer } from "../src/health/server.mjs";
import { initializeOpenAI } from "../src/openai/client.mjs";
import { startApplication } from "../src/app/main.mjs";

await startApplication({
  createDiscord,
  initializeOpenAI,
  log,
  registerHandlers,
  registerSignals,
  createHealthServer,
  rootDir: join(import.meta.dirname, ".."),
});
