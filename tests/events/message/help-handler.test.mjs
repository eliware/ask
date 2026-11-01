import { expect, jest, test } from "@jest/globals";
import messageCreate from "../../../src/events/messageCreate.mjs";
import { handleMessageHelp } from "../../../src/events/message/help-handler.mjs";

test("replies with localized help and handles the command", async () => {
  const log = { debug: jest.fn() };
  const msg = jest.fn((locale, key, fallback) => `${locale}:${key}:${fallback}`);
  const message = { content: "!help", reply: jest.fn() };

  await expect(handleMessageHelp({ log, msg }, message, "fr")).resolves.toBe(true);

  expect(msg).toHaveBeenCalledWith("fr", "help", "This is the help text.", log);
  expect(message.reply).toHaveBeenCalledWith("fr:help:This is the help text.");
  expect(log.debug).toHaveBeenCalledWith("!help Response", {
    response: "fr:help:This is the help text.",
  });
});

test("leaves other messages for trigger routing", async () => {
  const message = { content: "Ask a question", reply: jest.fn() };

  await expect(
    handleMessageHelp({ log: { debug: jest.fn() }, msg: jest.fn() }, message, "en"),
  ).resolves.toBe(false);
  expect(message.reply).not.toHaveBeenCalled();
});

test("routes help messages before invoking the ask handler", async () => {
  const log = { debug: jest.fn(), error: jest.fn() };
  const msg = jest.fn(() => "localized help");
  const ask = jest.fn();
  const message = {
    id: "help-message",
    content: "!help",
    guild: { preferredLocale: "fr" },
    reply: jest.fn(),
  };

  await messageCreate({ client: {}, log, msg, commandHandlers: { ask } }, message);

  expect(message.reply).toHaveBeenCalledWith("localized help");
  expect(ask).not.toHaveBeenCalled();
});
