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
  await send({ content: "x".repeat(2100), files: ["second"] });

  expect(replied[0]).toEqual({ content: '{"answer":1}', files: ["file"] });
  expect(sent).toEqual([]);
  expect(replied[1]).toHaveProperty("files", ["second"]);
  expect(replied).toHaveLength(3);
  expect(replied[2]).toHaveLength(100);
});

test("prepares serialized response content and files for delivery", async () => {
  const replies = [];
  const send = createMessageSender({
    author: {},
    reply: async (value) => replies.push(value),
  });

  await send({ content: { answer: 1 }, files: ["image"] });

  expect(replies).toEqual([{ content: '{"answer":1}', files: ["image"] }]);
});

test("prepares plain text responses", async () => {
  const replies = [];
  const send = createMessageSender({ author: {}, reply: async (value) => replies.push(value) });

  await send("plain text");

  expect(replies).toEqual(["plain text"]);
});
