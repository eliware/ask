import { expect, test } from "@jest/globals";
import { createPresence } from "../../src/app/presence.mjs";

test("builds the Discord presence for the current version", () => {
  expect(createPresence("15.1.1")).toEqual({
    activities: [{ name: "ask v15.1.1", type: 4 }],
    status: "online",
  });
});
