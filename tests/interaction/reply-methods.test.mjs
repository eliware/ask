import { jest } from "@jest/globals";
import { createMessageReplyMethods } from "../../src/interaction/reply-methods.mjs";

test("logs reply and edit failures and stops typing", async () => {
  const log = { error: jest.fn() };
  const stopTyping = jest.fn();
  const send = jest.fn(async () => {
    throw new Error("send failed");
  });
  const methods = createMessageReplyMethods({ send, stopTyping, log });

  await methods.reply("reply");
  await methods.editReply("edit");

  expect(stopTyping).toHaveBeenCalledTimes(2);
  expect(send).toHaveBeenNthCalledWith(1, "reply", false);
  expect(send).toHaveBeenNthCalledWith(2, "edit");
  expect(log.error).toHaveBeenNthCalledWith(
    1,
    "mock interaction.reply failed",
    expect.objectContaining({ error: expect.objectContaining({ message: "send failed" }) }),
  );
  expect(log.error).toHaveBeenNthCalledWith(
    2,
    "mock interaction.editReply failed",
    expect.objectContaining({ error: expect.objectContaining({ message: "send failed" }) }),
  );
});
