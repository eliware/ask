import prepareMessagePayloads from "../../src/interaction/payload.mjs";

test("serializes content before splitting", async () => {
  await expect(prepareMessagePayloads({ content: { answer: 1 } })).resolves.toEqual([
    '{"answer":1}',
  ]);
});

test("prepares plain text responses", async () => {
  await expect(prepareMessagePayloads("plain text")).resolves.toEqual(["plain text"]);
});
