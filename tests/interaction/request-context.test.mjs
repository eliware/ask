import { jest } from "@jest/globals";
import getRequestContext from "../../src/interaction/request-context.mjs";

test("builds context from interaction fields", async () => {
  const context = await getRequestContext({
    client: null,
    interaction: {
      locale: "en-US",
      options: { getString: () => "hi" },
      user: { id: "u", username: "User" },
      channelId: "c",
      channel: { name: "channel" },
      guildId: "g",
      guild: { name: "guild" },
    },
    log: { debug() {} },
  });
  expect(context).toEqual({
    locale: "en-US",
    query: "hi",
    userId: "u",
    userName: "User",
    channelId: "c",
    channelName: "channel",
    guildId: "g",
    guildName: "guild",
  });
});

test("uses fallbacks and data options", async () => {
  const context = await getRequestContext({
    client: null,
    interaction: {
      guildLocale: "fr-CA",
      guild: { preferredLocale: "fr", id: "g" },
      data: { options: [{ value: "data query" }] },
      member: { user: { id: "member", username: "Member" } },
      channel: { id: "channel" },
    },
    log: { debug() {} },
  });
  expect(context).toMatchObject({
    locale: "fr-CA",
    query: "data query",
    userId: "member",
    userName: "Member",
    channelId: "channel",
    guildId: "g",
  });
});

test("uses default and null values when fields are absent", async () => {
  const context = await getRequestContext({ client: null, interaction: {}, log: { debug() {} } });
  expect(context).toEqual({
    locale: "en-US",
    query: undefined,
    userId: null,
    userName: null,
    channelId: null,
    channelName: null,
    guildId: null,
    guildName: null,
  });
});

test("enriches missing names from channel and guild", async () => {
  const fetchChannel = jest
    .fn()
    .mockResolvedValue({ name: "fetched channel", guild: { name: "fetched guild" } });
  const context = await getRequestContext({
    client: { channels: { fetch: fetchChannel }, guilds: { fetch: jest.fn() } },
    interaction: { channelId: "c", guildId: "g" },
    log: { debug() {} },
  });
  expect(fetchChannel).toHaveBeenCalledWith("c");
  expect(context).toMatchObject({ channelName: "fetched channel", guildName: "fetched guild" });
});
