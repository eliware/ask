import { prepareMessagePayloads } from "../../src/interaction/payload.mjs";

test("serializes content before splitting", async () => {
  await expect(prepareMessagePayloads({ content: { answer: 1 } })).resolves.toEqual([
    '{"answer":1}',
  ]);
});

test("splits long content into chunks", async () => {
  await expect(prepareMessagePayloads("x".repeat(2100))).resolves.toEqual([
    "x".repeat(2000),
    "x".repeat(100),
  ]);
});

test("prepares plain text responses", async () => {
  await expect(prepareMessagePayloads("plain text")).resolves.toEqual(["plain text"]);
});
