import { jest } from "@jest/globals";
import { buildConversationInput } from "../../src/conversation/history.mjs";
import { fetchConversationHistory } from "../../src/conversation/fetch-history.mjs";

const log = { debug: jest.fn() };

beforeEach(() => log.debug.mockClear());

test("builds system, prior messages, and query input", async () => {
  const interaction = {
    channel: {
      messages: {
        fetch: jest.fn(
          async () => new Map([["1", { content: "prior reply", author: { id: "bot" } }]]),
        ),
      },
    },
  };
  const input = await buildConversationInput({
    client: { user: { id: "bot" } },
    interaction,
    channelId: "c",
    query: "new",
    locale: "en-US",
    log,
  });

  expect(input).toEqual([
    input[0],
    { role: "assistant", content: [{ type: "output_text", text: "prior reply" }] },
    { role: "user", content: [{ type: "input_text", text: "new" }] },
  ]);
  expect(input[0].content[0].text).toContain("en-US");
});

test("logs unexpected errors while building conversation input", async () => {
  const interaction = {};
  Object.defineProperty(interaction, "channel", {
    get: () => {
      throw new Error("broken channel");
    },
  });
  const input = await buildConversationInput({ interaction, query: "q", locale: "en", log });

  expect(input).toHaveLength(2);
  expect(log.debug).toHaveBeenCalledWith("Failed to fetch/attach channel history", {
    error: "broken channel",
  });
});

test("returns recent messages in chronological order without current or empty messages", async () => {
  const interaction = {
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
  };
  const history = await fetchConversationHistory({
    client: { user: { id: "bot" } },
    interaction,
    log,
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
    log,
  });

  expect(clientFetch).toHaveBeenCalledWith("channel");
  expect(fetch).toHaveBeenCalledWith({ limit: 100 });
  expect(history).toEqual([
    { role: "user", content: [{ type: "input_text", text: "from client" }] },
  ]);
});

test("returns no history when client lookup rejects or fetch returns no values", async () => {
  const noChannel = await fetchConversationHistory({
    client: { channels: { fetch: jest.fn(async () => Promise.reject(new Error("missing"))) } },
    interaction: { channel: { messages: {} } },
    channelId: "missing",
    log,
  });
  const noMessages = await fetchConversationHistory({
    interaction: { channel: { messages: { fetch: jest.fn(async () => ({})) } } },
    log,
  });
  const noClientFetcher = await fetchConversationHistory({
    client: { channels: { fetch: jest.fn(async () => ({})) } },
    interaction: { channel: { messages: {} } },
    channelId: "channel",
    log,
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
