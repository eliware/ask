import { deliverMessageChunk } from "../../src/interaction/delivery.mjs";

test("routes private replies to the author", async () => {
  const sent = [];
  const message = { author: { send: async (payload) => sent.push(payload) } };

  await deliverMessageChunk(message, "private", true, true);

  expect(sent).toEqual(["private"]);
});

test("replies to the request before sending later chunks to the channel", async () => {
  const replies = [];
  const messages = [];
  const message = {
    author: {},
    reply: async (payload) => replies.push(payload),
    channel: { send: async (payload) => messages.push(payload) },
  };

  await deliverMessageChunk(message, "first", false, true);
  await deliverMessageChunk(message, "later", false, false);

  expect(replies).toEqual(["first"]);
  expect(messages).toEqual(["later"]);
});

test("replies when the channel cannot send messages", async () => {
  const replies = [];
  const message = { author: {}, reply: async (payload) => replies.push(payload), channel: {} };

  await deliverMessageChunk(message, "later", false, false);

  expect(replies).toEqual(["later"]);
});
