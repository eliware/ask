import deliverMessageChunk from "../../src/interaction/delivery.mjs";

test("replies with the first channel payload", async () => {
  const replies = [];
  const message = {
    author: {},
    reply: async (payload) => replies.push(payload),
    channel: { send: async () => {} },
  };

  await deliverMessageChunk(message, "first", false, true);

  expect(replies).toEqual(["first"]);
});

test("sends later channel payloads through the channel", async () => {
  const messages = [];
  const message = {
    author: {},
    reply: async () => {},
    channel: { send: async (payload) => messages.push(payload) },
  };

  await deliverMessageChunk(message, "later", false, false);

  expect(messages).toEqual(["later"]);
});
