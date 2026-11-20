import deliverResponse from "../../src/response/delivery.mjs";
import createMessageInteraction from "../../src/interaction/message.mjs";
import createMessageSender from "../../src/interaction/sender.mjs";

const log = { debug() {} };

test("delivers message-backed responses with files and URLs", async () => {
  let sent;
  await deliverResponse(
    {
      _omitBlockquote: true,
      reply: async (value) => {
        sent = value;
      },
    },
    "ok",
    [{ buffer: Buffer.from("x"), filename: "x.png" }, { url: "https://x.test/a" }],
    false,
    log,
  );

  expect(sent).toMatchObject({ content: "ok\n\nhttps://x.test/a", files: [{ name: "x.png" }] });
});

test("splits combined maximum-length text and image URLs into valid messages", async () => {
  const replies = [];
  const channelMessages = [];
  const sender = createMessageSender({
    reply: async (message) => replies.push(message),
    channel: { send: async (message) => channelMessages.push(message) },
  });

  await deliverResponse(
    { _omitBlockquote: true, reply: sender },
    "a".repeat(2000),
    [{ url: "https://images.example.test/image.png" }],
    false,
    log,
  );

  const messages = [...replies, ...channelMessages];
  const contents = messages.map((message) =>
    typeof message === "string" ? message : message.content,
  );
  expect(messages.length).toBeGreaterThan(1);
  expect(contents.every((content) => content.length <= 2000)).toBe(true);
  expect(contents.join("\n")).toContain("https://images.example.test/image.png");
});

test("edits deferred message-backed responses", async () => {
  let edited;
  await deliverResponse(
    {
      _omitBlockquote: true,
      editReply: async (value) => {
        edited = value;
      },
    },
    "",
    [],
    true,
    log,
  );

  expect(edited).toEqual({});
});

test("adds image URLs to message-backed responses without text", async () => {
  let sent;
  await deliverResponse(
    {
      _omitBlockquote: true,
      reply: async (value) => {
        sent = value;
      },
    },
    "",
    [{ url: "u" }],
    false,
    log,
  );

  expect(sent.content).toBe("u");
});

test("routes message-backed replies without blockquotes", async () => {
  let messageReply;
  let slashReply;
  await deliverResponse(
    {
      _omitBlockquote: true,
      reply: async (value) => (messageReply = value),
    },
    "answer",
    [],
    false,
    log,
  );
  await deliverResponse({ reply: async (value) => (slashReply = value) }, "answer", [], false, log);

  expect(messageReply).toEqual({ content: "answer" });
  expect(slashReply).toEqual({ content: "> answer" });
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
    log: { error() {} },
  });

  await deliverResponse(interaction, "x".repeat(2000), [{ url }], false, log);

  expect(replies).toHaveLength(2);
  expect(replies[0]).toHaveLength(2000);
  expect(replies[1].trim()).toBe(url);
});
