import { expect, jest, test } from "@jest/globals";
import { replyWithLocalizedHelp } from "../../../src/events/message/help.mjs";

test("replies with localized help", async () => {
  const log = { debug: jest.fn() };
  const msg = jest.fn((locale, key, fallback) => `${locale}:${key}:${fallback}`);
  const message = { reply: jest.fn() };

  await replyWithLocalizedHelp({ log, msg }, message, "fr");

  expect(msg).toHaveBeenCalledWith("fr", "help", "This is the help text.", log);
  expect(message.reply).toHaveBeenCalledWith("fr:help:This is the help text.");
  expect(log.debug).toHaveBeenCalledWith("!help Response", {
    response: "fr:help:This is the help text.",
  });
});
