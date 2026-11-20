import { jest } from "@jest/globals";
import deliverSlashFollowUps from "../../../src/response/slash/follow-up.mjs";

test("sends follow-up chunks", async () => {
  const sent = [];

  await deliverSlashFollowUps({ followUp: async (payload) => sent.push(payload) }, ["next"], {
    debug() {},
  });

  expect(sent).toEqual([{ content: "next" }]);
});

test("replies when follow-up delivery is unavailable", async () => {
  const sent = [];

  await deliverSlashFollowUps({ reply: async (payload) => sent.push(payload) }, ["next"], {
    debug() {},
  });

  expect(sent).toEqual([{ content: "next" }]);
});

test("logs follow-up delivery errors", async () => {
  const debug = jest.fn();

  await deliverSlashFollowUps(
    { followUp: async () => Promise.reject(new Error("failed")) },
    ["next"],
    { debug },
  );

  expect(debug).toHaveBeenCalledWith("Failed to send follow-up chunk", { error: "failed" });
});
