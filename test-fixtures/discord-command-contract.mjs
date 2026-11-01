import { loadDiscordCommandFile } from "./command-file.mjs";
import { validateDiscordCommandDefinition } from "./command-schema.mjs";

export function validateDiscordCommand(name) {
  return validateDiscordCommandDefinition(loadDiscordCommandFile(name));
}
