import { expect, jest, test } from "@jest/globals";
import { fetchConversationHistory } from "../src/fetchConversationHistory.mjs";

test("returns recent channel messages in chronological conversation order", async () => {
  const history = await fetchConversationHistory({
    client: { user: { id: "bot" } },
    interaction: {
      channel: {
        messages: {
          fetch: jest.fn(
            async () =>
              new Map([
                ["new", { content: " latest ", author: { id: "user" } }],
                ["old", { content: "answer", author: { id: "bot" } }],
              ]),
          ),
        },
      },
    },
    log: { debug: jest.fn() },
  });

  expect(history).toEqual([
    { role: "assistant", content: [{ type: "output_text", text: "answer" }] },
    { role: "user", content: [{ type: "input_text", text: "latest" }] },
  ]);
});

test("returns no history when client channel lookup rejects", async () => {
  const history = await fetchConversationHistory({
    client: { channels: { fetch: jest.fn(async () => Promise.reject(new Error("missing"))) } },
    interaction: { channel: { messages: {} } },
    channelId: "missing",
    log: { debug: jest.fn() },
  });

  expect(history).toEqual([]);
});
