import { expect, test } from "@jest/globals";
import { isAddressedByName, removeNameAddress } from "../../../src/events/message/addressing.mjs";

test.each([
  ["Ask what is here?", true],
  ["  ask, what is here?", true],
  ["hello", false],
  ["", false],
])("matches a name address in %p", (content, expected) => {
  expect(isAddressedByName(content)).toBe(expected);
});

test("removes the name address prefix", () => {
  expect(removeNameAddress("Ask, what is here?")).toBe("what is here?");
});
