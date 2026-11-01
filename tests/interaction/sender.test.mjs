import { jest } from "@jest/globals";
import { createMessageReplyMethods, createMessageSender } from "../../src/interaction/sender.mjs";

test("sends chunks, files, objects, and private replies", async () => {
  const sent = [];
  const replied = [];
  const message = {
    author: { send: async (value) => sent.push(value) },
    reply: async (value) => replied.push(value),
  };
  const send = createMessageSender(message);

  await send({ content: { answer: 1 }, files: ["file"] });
  await send({ content: "private", flags: 1 << 6 }, true);
  await send({ content: "x".repeat(2100), files: ["second"] });

  expect(replied[0]).toEqual({ content: '{"answer":1}', files: ["file"] });
  expect(sent).toEqual(["private"]);
  expect(replied[1]).toHaveProperty("files", ["second"]);
  expect(replied).toHaveLength(3);
  expect(replied[2]).toHaveLength(100);
});

test("uses the local splitter when the Discord splitter is unavailable", async () => {
  jest.resetModules();
  jest.unstable_mockModule("@eliware/discord", () => ({}));
  const { createMessageSender: createFallbackSender } =
    await import("../../src/interaction/sender.mjs");
  const replies = [];
  const send = createFallbackSender({ author: {}, reply: async (value) => replies.push(value) });

  await send("y".repeat(2100));

  expect(replies).toHaveLength(2);
});

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
