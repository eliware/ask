import { createMessageSender } from "../../src/interaction/sender.mjs";

test("delivers the first chunk as a reply and later chunks to the channel", async () => {
  const replies = [];
  const messages = [];
  const send = createMessageSender({
    author: {},
    reply: async (value) => replies.push(value),
    channel: { send: async (value) => messages.push(value) },
  });

  await send("x".repeat(2100));

  expect(replies).toEqual(["x".repeat(2000)]);
  expect(messages).toEqual(["x".repeat(100)]);
});

test("delivers private chunks to the author", async () => {
  const sent = [];
  const send = createMessageSender({ author: { send: async (value) => sent.push(value) } });

  await send("private", true);

  expect(sent).toEqual(["private"]);
});
