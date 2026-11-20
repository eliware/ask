import { expect, test } from "@jest/globals";
import serializeMessageContent from "../../src/interaction/serialization.mjs";

test("serializes response content and values without a content field", () => {
  expect(serializeMessageContent({ content: "plain text" })).toBe("plain text");
  expect(serializeMessageContent({ content: { answer: 1 } })).toBe('{"answer":1}');
  expect(serializeMessageContent({ answer: 1 })).toBe('{"answer":1}');
});

test("serializes null and undefined values", () => {
  expect(serializeMessageContent(null)).toBe("null");
  expect(serializeMessageContent(undefined)).toBeUndefined();
});

test("does not serialize file metadata as message content", () => {
  expect(serializeMessageContent({ files: [{ name: "image.png" }] })).toBe("");
});
