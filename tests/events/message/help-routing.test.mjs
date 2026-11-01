import { expect, jest, test } from "@jest/globals";
import { routeMessageHelp } from "../../../src/events/message/help-routing.mjs";

test("replies with localized help and handles the command", async () => {
  const log = { debug: jest.fn() };
  const msg = jest.fn((locale, key, fallback) => `${locale}:${key}:${fallback}`);
  const message = { content: "!help", reply: jest.fn() };

  await expect(routeMessageHelp({ log, msg }, message, "fr")).resolves.toBe(true);

  expect(msg).toHaveBeenCalledWith("fr", "help", "This is the help text.", log);
  expect(message.reply).toHaveBeenCalledWith("fr:help:This is the help text.");
  expect(log.debug).toHaveBeenCalledWith("!help Response", {
    response: "fr:help:This is the help text.",
  });
});

test("leaves other messages for trigger routing", async () => {
  const message = { content: "Ask a question", reply: jest.fn() };

  await expect(
    routeMessageHelp({ log: { debug: jest.fn() }, msg: jest.fn() }, message, "en"),
  ).resolves.toBe(false);
  expect(message.reply).not.toHaveBeenCalled();
});
