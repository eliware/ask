import { expect, jest, test } from "@jest/globals";
import { fetchConversationHistory } from "../../src/conversation/fetch-history.mjs";

test("returns recent channel messages in chronological conversation order", async () => {
  const history = await fetchConversationHistory({
    client: { user: { id: "bot" } },
    interaction: {
      sourceMessageId: "current",
      channel: {
        messages: {
          fetch: jest.fn(
            async () =>
              new Map([
                ["current", { id: "current", content: "current request", author: { id: "user" } }],
                ["new", { id: "new", content: " latest ", author: { id: "user" } }],
                ["old", { id: "old", content: "answer", author: { id: "bot" } }],
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

test("fetches history from the client when interaction has no fetcher", async () => {
  const fetch = jest.fn(async () => new Map([["1", { content: "from client", author: {} }]]));
  const clientFetch = jest.fn(async () => ({ messages: { fetch } }));
  const history = await fetchConversationHistory({
    client: { user: { id: "bot" }, channels: { fetch: clientFetch } },
    interaction: { channel: { messages: {} } },
    channelId: "channel",
    log: { debug: jest.fn() },
  });

  expect(clientFetch).toHaveBeenCalledWith("channel");
  expect(fetch).toHaveBeenCalledWith({ limit: 100 });
  expect(history).toEqual([
    { role: "user", content: [{ type: "input_text", text: "from client" }] },
  ]);
});
