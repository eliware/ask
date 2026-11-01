import { deliverResponse } from "../../src/response/delivery.mjs";

const log = { debug() {} };

test("ignores nontext response objects instead of stringifying them", async () => {
  let sent;
  await deliverResponse(
    { reply: async (value) => (sent = value) },
    { image: "generated" },
    [],
    false,
    log,
  );

  expect(sent.content).toMatch(/could not create/);
  expect(sent.content).not.toContain("[object Object]");
});
