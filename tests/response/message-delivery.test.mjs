import { deliverResponse } from "../../src/response/delivery.mjs";

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
