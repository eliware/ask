import { jest } from "@jest/globals";
import createMessageInteraction from "../../src/interaction/message.mjs";

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
