import { createMessageSender } from "../../src/interaction/sender.mjs";

test("prepares and sends a message response", async () => {
  const replies = [];
  const send = createMessageSender({ author: {}, reply: async (value) => replies.push(value) });

  await send({ content: "answer", files: ["image"] });

  expect(replies).toEqual([{ content: "answer", files: ["image"] }]);
});
