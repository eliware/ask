import { readFileSync } from "node:fs";
import { join } from "node:path";

export function loadDiscordCommandFile(name, directory = join(process.cwd(), "commands")) {
  return JSON.parse(readFileSync(join(directory, name + ".json"), "utf8"));
}
