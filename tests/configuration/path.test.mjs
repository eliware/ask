import { expect, test } from "@jest/globals";
import { join } from "node:path";
import getEnvironmentPath from "../../src/configuration/path.mjs";

test("builds the environment file path", () => {
  expect(getEnvironmentPath("application/root")).toBe(join("application/root", ".env"));
});
