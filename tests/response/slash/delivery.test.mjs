import deliverSlashResponse from "../../../src/response/slash/delivery.mjs";

const log = { debug() {} };

test("delivers image attachments without text", async () => {
  let sent;
  await deliverSlashResponse(
    { reply: async (value) => (sent = value) },
    "",
    [{ attachment: Buffer.from("image"), name: "image.png" }],
    [],
    false,
    log,
  );
  expect(sent).toEqual({ files: [{ attachment: Buffer.from("image"), name: "image.png" }] });
});

test("delivers long responses, attachments, URLs, and follow-ups", async () => {
  const calls = [];
  const interaction = {
    reply: async (value) => calls.push(["reply", value]),
    followUp: async (value) => calls.push(["follow", value]),
  };
  await deliverSlashResponse(
    interaction,
    "a".repeat(5000),
    [{ attachment: Buffer.from("x"), name: "x" }],
    ["https://x.test/a"],
    false,
    log,
  );
  expect(calls[0][1].files).toBeDefined();
  expect(calls.some(([type]) => type === "follow")).toBe(true);
});

test("uses a fallback message when no text or images exist", async () => {
  let sent;
  await deliverSlashResponse(
    { reply: async (message) => (sent = message) },
    "",
    [],
    [],
    false,
    log,
  );
  expect(sent.content).toMatch(/could not create/);
});

test("falls back to replies for follow-ups and logs failures", async () => {
  const calls = [];
  await deliverSlashResponse(
    { reply: async (value) => calls.push(value) },
    "a".repeat(5000),
    [],
    [],
    false,
    log,
  );
  expect(calls.length).toBeGreaterThan(1);
  let first = true;
  const failing = {
    reply: async () => {
      if (first) {
        first = false;
        return;
      }
      throw new Error("fail");
    },
    followUp: async () => {
      throw new Error("fail");
    },
  };
  await deliverSlashResponse(failing, "a".repeat(5000), [], [], false, log);
});

test("delivers attachments without text and deferred empty replies", async () => {
  let sent;
  await deliverSlashResponse(
    { reply: async (value) => (sent = value) },
    "",
    [{ attachment: Buffer.from("x"), name: "x" }],
    [],
    false,
    log,
  );
  expect(sent.files).toBeDefined();
  let edited;
  await deliverSlashResponse(
    { editReply: async (value) => (edited = value) },
    "",
    [],
    [],
    true,
    log,
  );
  expect(edited.content).toMatch(/could not create/);
});

test("delivers deferred text and URL-only output", async () => {
  let edited;
  const followUps = [];
  await deliverSlashResponse(
    {
      editReply: async (value) => (edited = value),
      followUp: async (value) => followUps.push(value),
    },
    "short",
    [],
    ["https://x.test/a"],
    true,
    log,
  );
  expect(edited.content).toBe("> short");
  expect(followUps[0].content).toBe("https://x.test/a");
  let sent;
  await deliverSlashResponse(
    { reply: async (value) => (sent = value) },
    "",
    [],
    ["https://x.test/a"],
    false,
    log,
  );
  expect(sent.content).toBe("https://x.test/a");
});

test("delivers deferred URL-only output", async () => {
  let edited;
  await deliverSlashResponse(
    { editReply: async (value) => (edited = value) },
    "",
    [],
    ["u"],
    true,
    log,
  );
  expect(edited.content).toBe("u");
});

test("stringifies follow-up errors without messages", async () => {
  let first = true;
  const interaction = {
    reply: async () => {
      if (first) first = false;
    },
    followUp: async () => {
      throw "broken";
    },
  };
  await deliverSlashResponse(interaction, "a".repeat(5000), [], [], false, {
    debug: (...args) => expect(args[1].error).toBe("broken"),
  });
});
