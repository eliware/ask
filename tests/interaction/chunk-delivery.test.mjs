import { deliverMessageChunks } from "../../src/interaction/chunk-delivery.mjs";

test("delivers the first payload as a reply and later payloads to the channel", async () => {
  const replies = [];
  const messages = [];
  const message = {
    author: {},
    reply: async (payload) => replies.push(payload),
    channel: { send: async (payload) => messages.push(payload) },
  };

  await deliverMessageChunks(message, ["first", "second"], false);

  expect(replies).toEqual(["first"]);
  expect(messages).toEqual(["second"]);
});

test("delivers private payloads to the author in order", async () => {
  const sent = [];
  const message = { author: { send: async (payload) => sent.push(payload) } };

  await deliverMessageChunks(message, ["first", "second"], true);

  expect(sent).toEqual(["first", "second"]);
});
