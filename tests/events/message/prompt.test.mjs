import { expect, test } from "@jest/globals";
import extractMessagePrompt from "../../../src/events/message/prompt.mjs";

test.each([
  ["Ask what is here?", true, "what is here?"],
  ["Ask", true, "Hello!"],
  ["  ", false, "Hello!"],
])("extracts a prompt from %p", (content, addressedByName, expected) => {
  expect(extractMessagePrompt(content, addressedByName)).toBe(expected);
});
