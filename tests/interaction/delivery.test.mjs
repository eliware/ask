import deliverMessageChunk from "../../src/interaction/delivery.mjs";

test("sends private payloads to the author", async () => {
  const sent = [];
  const message = {
    author: { send: async (payload) => sent.push(payload) },
    reply: async () => {},
    channel: { send: async () => {} },
  };

  await deliverMessageChunk(message, "private", true, false);

  expect(sent).toEqual(["private"]);
});
