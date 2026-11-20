import deliverMessageChunk from "../../src/interaction/delivery.mjs";

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
