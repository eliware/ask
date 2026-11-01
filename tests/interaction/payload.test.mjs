import { prepareMessagePayloads } from "../../src/interaction/payload.mjs";

test("serializes content and attaches files to the first payload", async () => {
  await expect(
    prepareMessagePayloads({ content: { answer: 1 }, files: ["image"] }),
  ).resolves.toEqual([{ content: '{"answer":1}', files: ["image"] }]);
});

test("attaches files only to the first chunk", async () => {
  await expect(
    prepareMessagePayloads({ content: "x".repeat(2100), files: ["image"] }),
  ).resolves.toEqual([{ content: "x".repeat(2000), files: ["image"] }, "x".repeat(100)]);
});

test("prepares plain text responses", async () => {
  await expect(prepareMessagePayloads("plain text")).resolves.toEqual(["plain text"]);
});
