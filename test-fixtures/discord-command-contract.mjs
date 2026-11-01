import { readFileSync } from "node:fs";
import { join } from "node:path";
import { validateDiscordCommandDefinition } from "./command-schema.mjs";

export function validateDiscordCommand(name) {
  const filePath = join(process.cwd(), "commands", name + ".json");
  const command = JSON.parse(readFileSync(filePath, "utf8"));
  return validateDiscordCommandDefinition(command);
}
