import { createMessageSender } from "../../src/interaction/sender.mjs";

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

test("sends later chunks to the channel after replying to the request", async () => {
  const replies = [];
  const messages = [];
  const send = createMessageSender({
    author: {},
    reply: async (value) => replies.push(value),
    channel: { send: async (value) => messages.push(value) },
  });

  await send("x".repeat(2100));

  expect(replies).toHaveLength(1);
  expect(replies[0]).toHaveLength(2000);
  expect(messages).toHaveLength(1);
  expect(messages[0]).toHaveLength(100);
});
