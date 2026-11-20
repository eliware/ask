import { jest } from "@jest/globals";
import enrichRequestContext from "../../src/interaction/context-enrichment.mjs";

test("fills missing channel and guild names from the channel", async () => {
  const context = { channelId: "c", channelName: null, guildId: "g", guildName: null };
  const fetchChannel = jest
    .fn()
    .mockResolvedValue({ name: "fetched channel", guild: { name: "fetched guild" } });

  await enrichRequestContext(
    context,
    { channels: { fetch: fetchChannel }, guilds: { fetch: jest.fn() } },
    { debug() {} },
  );

  expect(fetchChannel).toHaveBeenCalledWith("c");
  expect(context).toMatchObject({ channelName: "fetched channel", guildName: "fetched guild" });
});

test("keeps existing names while filling the missing name", async () => {
  const context = { channelId: "c", channelName: "known channel", guildId: "g", guildName: null };

  await enrichRequestContext(
    context,
    {
      channels: {
        fetch: jest
          .fn()
          .mockResolvedValue({ name: "other channel", guild: { name: "fetched guild" } }),
      },
      guilds: { fetch: jest.fn() },
    },
    { debug() {} },
  );

  expect(context).toMatchObject({ channelName: "known channel", guildName: "fetched guild" });
});

test("keeps the guild name while filling a missing channel name", async () => {
  const context = { channelId: "c", channelName: null, guildId: "g", guildName: "known guild" };

  await enrichRequestContext(
    context,
    {
      channels: { fetch: jest.fn().mockResolvedValue({ name: "fetched channel" }) },
      guilds: { fetch: jest.fn() },
    },
    { debug() {} },
  );

  expect(context).toMatchObject({ channelName: "fetched channel", guildName: "known guild" });
});

test("keeps missing names when fetched channel fields are absent", async () => {
  const context = { channelId: "c", channelName: null, guildId: "g", guildName: null };

  await enrichRequestContext(
    context,
    { channels: { fetch: jest.fn().mockResolvedValue({}) }, guilds: { fetch: jest.fn() } },
    { debug() {} },
  );

  expect(context).toMatchObject({ channelName: null, guildName: null });
});

test("fetches the guild when the channel does not provide its name", async () => {
  const context = { channelId: "c", channelName: null, guildId: "g", guildName: null };
  const fetchGuild = jest.fn().mockResolvedValue({ name: "fetched guild" });

  await enrichRequestContext(
    context,
    { channels: { fetch: jest.fn().mockResolvedValue(null) }, guilds: { fetch: fetchGuild } },
    { debug() {} },
  );

  expect(fetchGuild).toHaveBeenCalledWith("g");
  expect(context.guildName).toBe("fetched guild");
});

test("keeps context when expected fetches fail", async () => {
  const context = { channelId: "c", channelName: null, guildId: "g", guildName: null };

  await enrichRequestContext(
    context,
    {
      channels: { fetch: jest.fn().mockRejectedValue(new Error("channel failed")) },
      guilds: { fetch: jest.fn().mockRejectedValue("guild failed") },
    },
    { debug: jest.fn() },
  );

  expect(context).toMatchObject({ channelName: null, guildName: null });
});

test("logs unexpected enrichment failures", async () => {
  const debug = jest.fn();
  const client = {};
  Object.defineProperty(client, "channels", {
    get: () => {
      throw "broken";
    },
  });

  await enrichRequestContext(
    { channelId: "c", channelName: null, guildId: null, guildName: null },
    client,
    { debug },
  );

  expect(debug).toHaveBeenCalledWith("Failed to enrich request context", { error: "broken" });
});
