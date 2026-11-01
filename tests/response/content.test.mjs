import { expect, test } from "@jest/globals";
import { extractContentText, getContentItems } from "../../src/response/content.mjs";

test("selects content items from supported shapes", () => {
  expect(getContentItems({ content: ["array"] })).toEqual(["array"]);
  expect(getContentItems({ content: { one: "object" } })).toEqual(["object"]);
  expect(getContentItems({ content: "string" })).toEqual(["string"]);
  expect(getContentItems({ data: ["data array"] })).toEqual(["data array"]);
  expect(getContentItems({ data: { one: "data object" } })).toEqual(["data object"]);
  expect(getContentItems("output string")).toEqual(["output string"]);
  expect(getContentItems({ content: null })).toEqual([]);
  expect(getContentItems(null)).toEqual([]);
});

test("extracts text from supported content values", () => {
  expect(extractContentText("plain")).toBe("plain");
  expect(extractContentText({ text: "text" })).toBe("text");
  expect(extractContentText({ output_text: "output" })).toBe("output");
  expect(extractContentText({ content: "content" })).toBe("content");
  expect(extractContentText({ text: 1 })).toBe("");
  expect(extractContentText(null)).toBe("");
});
