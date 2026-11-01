import { expect, jest, test } from "@jest/globals";
import { fetchConversationHistory } from "../../src/conversation/history.mjs";

test("skips client lookup when no channel ID is available", async () => {
  const fetchChannel = jest.fn();
  const history = await fetchConversationHistory({
    client: { channels: { fetch: fetchChannel } },
    interaction: {},
    channelId: "",
    log: { debug: jest.fn() },
  });

  expect(history).toEqual([]);
  expect(fetchChannel).not.toHaveBeenCalled();
});

test("returns recent messages in chronological order without current or empty messages", async () => {
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
                ["empty", { id: "empty", content: "", author: { id: "user" } }],
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

test("fetches client channel history when interaction has no fetcher", async () => {
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

test("returns no history for rejected lookups and missing fetchers", async () => {
  const noChannel = await fetchConversationHistory({
    client: { channels: { fetch: jest.fn(async () => Promise.reject(new Error("missing"))) } },
    interaction: { channel: { messages: {} } },
    channelId: "missing",
    log: { debug: jest.fn() },
  });
  const noMessages = await fetchConversationHistory({
    interaction: { channel: { messages: { fetch: jest.fn(async () => ({})) } } },
    log: { debug: jest.fn() },
  });
  const noClientFetcher = await fetchConversationHistory({
    client: { channels: { fetch: jest.fn(async () => ({})) } },
    interaction: { channel: { messages: {} } },
    channelId: "channel",
    log: { debug: jest.fn() },
  });

  expect(noChannel).toEqual([]);
  expect(noMessages).toEqual([]);
  expect(noClientFetcher).toEqual([]);
});

test("falls back after fetcher rejections and logs unexpected errors", async () => {
  const interactionFetch = jest.fn(async () => Promise.reject(new Error("unavailable")));
  const clientFetch = jest.fn(async () => ({
    messages: { fetch: jest.fn(async () => Promise.reject(new Error("unavailable"))) },
  }));
  const log = { debug: jest.fn() };
  const history = await fetchConversationHistory({
    client: { channels: { fetch: clientFetch } },
    interaction: { channel: { messages: { fetch: interactionFetch } } },
    channelId: "channel",
    log,
  });

  expect(interactionFetch).toHaveBeenCalledWith({ limit: 100 });
  expect(clientFetch).toHaveBeenCalledWith("channel");
  expect(history).toEqual([]);

  const brokenInteraction = {};
  Object.defineProperty(brokenInteraction, "channel", {
    get: () => {
      throw "broken";
    },
  });
  await fetchConversationHistory({ interaction: brokenInteraction, log });
  expect(log.debug).toHaveBeenCalledWith("Failed to fetch/attach channel history", {
    error: "broken",
  });
});
