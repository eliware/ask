import { expect, jest, test } from "@jest/globals";
import { join } from "node:path";
import { loadEnvironment } from "../../src/configuration/environment.mjs";

test("loads the environment file from the application root", () => {
  const configure = jest.fn();
  loadEnvironment("application", configure);

  expect(configure).toHaveBeenCalledWith({ path: join("application", ".env"), quiet: true });
});
