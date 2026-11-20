import { config } from "dotenv";
import getEnvironmentPath from "./path.mjs";

export default function loadEnvironment(rootDir, configure = config) {
  configure({ path: getEnvironmentPath(rootDir), quiet: true });
}
