import { deliverMessageChunk } from "../../src/interaction/delivery.mjs";

test("replies when the channel cannot send messages", async () => {
  const replies = [];
  const message = { author: {}, reply: async (payload) => replies.push(payload), channel: {} };

  await deliverMessageChunk(message, "later", false, false);

  expect(replies).toEqual(["later"]);
});
