import { config } from "dotenv";
import { join } from "node:path";

export function loadEnvironment(rootDir, configure = config) {
  configure({ path: join(rootDir, ".env"), quiet: true });
}
