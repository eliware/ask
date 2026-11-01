import { deliverResponse } from "../../src/response/delivery.mjs";

const log = { debug() {} };

test("routes message-backed and slash-command replies to their delivery paths", async () => {
  let messageReply;
  let slashReply;
  let objectReply;

  await deliverResponse(
    {
      _omitBlockquote: true,
      reply: async (value) => {
        messageReply = value;
      },
    },
    "answer",
    [],
    false,
    log,
  );
  await deliverResponse(
    {
      reply: async (value) => {
        slashReply = value;
      },
    },
    "answer",
    [],
    false,
    log,
  );
  await deliverResponse(
    {
      reply: async (value) => {
        objectReply = value;
      },
    },
    { image: "generated" },
    [],
    false,
    log,
  );

  expect(messageReply).toEqual({ content: "answer" });
  expect(slashReply).toEqual({ content: "> answer" });
  expect(objectReply.content).toMatch(/could not create/);
});
