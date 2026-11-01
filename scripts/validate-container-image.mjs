import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const environmentFile = resolve(rootDirectory, ".env");
const image = `ask:validation-${randomUUID()}`;
let createdEnvironmentFile = false;

function runDocker(args, quiet = false) {
  const result = spawnSync("docker", args, {
    cwd: rootDirectory,
    stdio: quiet ? "ignore" : "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`docker ${args[0]} failed with exit code ${result.status}`);
}

try {
  if (!existsSync(environmentFile)) {
    writeFileSync(environmentFile, "OPENAI_API_KEY=ASK_IMAGE_CHECK_SENTINEL\n", { flag: "wx" });
    createdEnvironmentFile = true;
  }

  runDocker(["build", "--tag", image, "."]);

  const verification = [
    'import { existsSync } from "node:fs";',
    'if (existsSync("/opt/ask/.env")) {',
    '  console.error("Container image includes /opt/ask/.env.");',
    "  process.exit(1);",
    "}",
    'if (!existsSync("/opt/ask/.env.example")) {',
    '  console.error("Container image is missing /opt/ask/.env.example.");',
    "  process.exit(1);",
    "}",
    'const credentialNames = ["DISCORD_CLIENT_ID", "DISCORD_TOKEN", "OPENAI_API_KEY"];',
    "if (credentialNames.some((name) => process.env[name])) {",
    '  console.error("Container image includes a runtime credential.");',
    "  process.exit(1);",
    "}",
    'console.log("Container image excludes local environment files and runtime credentials.");',
  ].join("\n");

  runDocker(["run", "--rm", "--entrypoint", "node", image, "-e", verification]);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (createdEnvironmentFile) unlinkSync(environmentFile);
  try {
    runDocker(["image", "rm", "--force", image], true);
  } catch {}
}
