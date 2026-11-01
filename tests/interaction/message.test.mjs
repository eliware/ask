import { jest } from "@jest/globals";
import { createMessageInteraction } from "../../src/interaction/message.mjs";
import { deliverResponse } from "../../src/response/delivery.mjs";

jest.setTimeout(10_000);

const log = () => ({ error: jest.fn() });

test("creates a message-backed interaction and sends replies", async () => {
  const replies = [];
  const privateMessages = [];
  const message = {
    author: { send: async (value) => privateMessages.push(value) },
    reply: async (value) => replies.push(value),
    channel: { id: "c", sendTyping: async () => {} },
  };
  const interaction = createMessageInteraction({
    client: { user: { id: "bot" } },
    message,
    locale: "en-US",
    text: "hi",
    log: log(),
  });
  await interaction.reply({ content: "hello" });
  await interaction.reply({ content: "private", flags: 1 << 6 });
  expect(replies).toEqual(["hello"]);
  expect(privateMessages).toEqual(["private"]);
  expect(interaction.commandName).toBe("ask");
  expect(interaction.guild).toBeUndefined();
  expect(interaction.guildId).toBeNull();
  expect(interaction.channelId).toBe("c");
  expect(interaction.options.getString()).toBe("hi");
});

test("exposes message metadata", () => {
  const message = {
    id: "source-message",
    guild: { id: "g" },
    author: { id: "u" },
    member: { id: "m" },
    channel: { id: "c" },
  };
  const interaction = createMessageInteraction({
    client: {},
    message,
    locale: "fr",
    text: "question",
    log: log(),
  });
  expect(interaction.sourceMessageId).toBe("source-message");
  expect(interaction.guildId).toBe("g");
  expect(interaction.user).toBe(message.author);
  expect(interaction.member).toBe(message.member);
});

test("splits message text before adding an image URL to the next chunk", async () => {
  const replies = [];
  const url = "https://example.test/image.png";
  const message = {
    id: "source-message",
    author: { id: "user" },
    channel: { id: "channel" },
    reply: async (value) => replies.push(value),
  };
  const interaction = createMessageInteraction({
    client: {},
    message,
    locale: "en-US",
    text: "question",
    log: log(),
  });

  await deliverResponse(interaction, "x".repeat(2000), [{ url }], false, log());

  expect(replies).toHaveLength(2);
  expect(replies[0]).toHaveLength(2000);
  expect(replies[1].trim()).toBe(url);
});

test("wires typing controls onto the interaction", async () => {
  const message = { author: {}, channel: { sendTyping: jest.fn() } };
  const interaction = createMessageInteraction({
    client: {},
    message,
    locale: "en",
    text: "",
    log: log(),
  });
  await interaction.deferReply();
  expect(message.channel.sendTyping).toHaveBeenCalledTimes(1);
  interaction.stopTyping();
});
