import { expect, jest, test } from "@jest/globals";
import { join } from "node:path";
import loadEnvironment from "../../src/configuration/environment.mjs";
import getEnvironmentPath from "../../src/configuration/path.mjs";

test("loads the environment file from the application root", () => {
  expect(getEnvironmentPath("application")).toBe(join("application", ".env"));
  const configure = jest.fn();
  loadEnvironment("application", configure);

  expect(configure).toHaveBeenCalledWith({ path: join("application", ".env"), quiet: true });
});
