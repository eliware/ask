import { join } from "node:path";

export default function getEnvironmentPath(rootDir) {
  return join(rootDir, ".env");
}
