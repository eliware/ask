import { expect, test } from "@jest/globals";
import { validateConfiguration } from "../../src/configuration/validate.mjs";

const requiredValues = {
  DISCORD_CLIENT_ID: "test-client-id",
  DISCORD_TOKEN: "test-discord-token",
  OPENAI_API_KEY: "test-openai-key",
};

test("accepts each required environment value", () => {
  expect(() => validateConfiguration(requiredValues)).not.toThrow();
});

test("uses process environment when no environment is passed", () => {
  const names = Object.keys(requiredValues);
  const originalValues = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  Object.assign(process.env, requiredValues);
  try {
    expect(() => validateConfiguration()).not.toThrow();
  } finally {
    for (const name of names) {
      if (originalValues[name] === undefined) delete process.env[name];
      else process.env[name] = originalValues[name];
    }
  }
});

test("reports all missing required environment values", () => {
  expect(() => validateConfiguration({})).toThrow(
    "Missing required environment values: DISCORD_CLIENT_ID, DISCORD_TOKEN, OPENAI_API_KEY",
  );
});

test("reports blank required values", () => {
  expect(() => validateConfiguration({ ...requiredValues, OPENAI_API_KEY: "   " })).toThrow(
    "Missing required environment values: OPENAI_API_KEY",
  );
});
