import { jest } from "@jest/globals";
import isReplyToBot from "../../../src/events/message/reply-detection.mjs";

test("detects a reply to the bot through the message fetch method", async () => {
  const message = {
    reference: { messageId: "reference-id" },
    fetchReference: jest.fn().mockResolvedValue({ author: { id: "bot-id" } }),
  };

  await expect(isReplyToBot(message, { user: { id: "bot-id" } }, { debug() {} })).resolves.toBe(
    true,
  );
  expect(message.fetchReference).toHaveBeenCalled();
});

test("uses the channel fetch method for legacy references", async () => {
  const fetch = jest.fn().mockResolvedValue({ author: { id: "other-id" } });

  await expect(
    isReplyToBot(
      { reference: { message: { id: "reference-id" } }, channel: { messages: { fetch } } },
      { user: { id: "bot-id" } },
      { debug() {} },
    ),
  ).resolves.toBe(false);
  expect(fetch).toHaveBeenCalledWith("reference-id");
});

test("returns false when no reference can be fetched", async () => {
  await expect(
    isReplyToBot(
      { reference: { messageId: "reference-id" }, channel: {} },
      { user: { id: "bot-id" } },
      { debug() {} },
    ),
  ).resolves.toBe(false);
  await expect(isReplyToBot({}, {}, { debug() {} })).resolves.toBe(false);
});

test("ignores rejected reference fetches", async () => {
  const log = { debug: jest.fn() };
  const message = {
    reference: { messageId: "reference-id" },
    fetchReference: jest.fn().mockRejectedValue(new Error("no access")),
  };

  await expect(isReplyToBot(message, { user: { id: "bot-id" } }, log)).resolves.toBe(false);
  expect(log.debug).not.toHaveBeenCalled();
});

test("logs unexpected reference lookup errors", async () => {
  const log = { debug: jest.fn() };
  const message = {};
  Object.defineProperty(message, "reference", {
    get: () => {
      throw new Error("broken reference");
    },
  });

  await expect(isReplyToBot(message, {}, log)).resolves.toBe(false);
  expect(log.debug).toHaveBeenCalledWith(
    "failed to resolve referenced message",
    expect.objectContaining({ error: expect.anything() }),
  );
});
