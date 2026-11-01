import { expect, test } from "@jest/globals";
import { isMessageTriggered } from "../../../src/events/message/triggers.mjs";

test.each([
  [{ isDirect: true }, true],
  [{ isMentioned: true }, true],
  [{ isReplyToBot: true }, true],
  [{ addressedByName: true }, true],
  [{ isDirect: false, isMentioned: false, isReplyToBot: false, addressedByName: false }, false],
])("decides whether a message has a trigger: %p", (triggers, expected) => {
  expect(isMessageTriggered(triggers)).toBe(expected);
});
