import { expect, test } from "@jest/globals";
import removeMessageMentions from "../../../src/events/message/mentions.mjs";

test("removes user, role, and channel mentions", () => {
  expect(removeMessageMentions("<@!bot-id> <@&role-id> <#channel-id> please help")).toBe(
    "   please help",
  );
});
