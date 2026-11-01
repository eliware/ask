import { createMessageMetadata } from "../../src/interaction/metadata.mjs";

test("builds metadata for a message-backed interaction", () => {
  const client = {};
  const message = {
    id: "source-message",
    guild: { id: "g" },
    author: { id: "u" },
    member: { id: "m" },
    channel: { id: "c" },
  };

  expect(createMessageMetadata({ client, message, locale: "fr", text: "question" })).toMatchObject({
    commandName: "ask",
    locale: "fr",
    client,
    guild: message.guild,
    guildId: "g",
    channelId: "c",
    channel: message.channel,
    sourceMessageId: "source-message",
    user: message.author,
    member: message.member,
    data: { options: [{ value: "question" }] },
    _omitBlockquote: true,
  });
});

test("provides message option text", () => {
  const metadata = createMessageMetadata({
    client: {},
    message: { author: {}, channel: {} },
    locale: "en",
    text: "hello",
  });

  expect(metadata.options.getString()).toBe("hello");
  expect(metadata.guild).toBeUndefined();
  expect(metadata.guildId).toBeNull();
  expect(metadata.channelId).toBeNull();
  expect(metadata.member).toBeNull();
});
