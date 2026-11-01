import { expect, test } from "@jest/globals";
import { isAddressedByName, isMessageTriggered } from "../../../src/events/message/triggers.mjs";

test.each([
  ["Ask what is here?", true],
  ["  ask, what is here?", true],
  ["ASK!", true],
  ["asking about this", false],
  ["hello", false],
  ["", false],
])("detects the Ask name prefix in %p", (content, expected) => {
  expect(isAddressedByName(content)).toBe(expected);
});

test.each([
  [{ isDirect: true }, true],
  [{ isMentioned: true }, true],
  [{ isReplyToBot: true }, true],
  [{ addressedByName: true }, true],
  [{ isDirect: false, isMentioned: false, isReplyToBot: false, addressedByName: false }, false],
])("decides whether a message has a trigger: %p", (triggers, expected) => {
  expect(isMessageTriggered(triggers)).toBe(expected);
});
