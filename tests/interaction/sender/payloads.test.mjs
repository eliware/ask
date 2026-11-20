import prepareSenderPayloads from "../../../src/interaction/sender/payloads.mjs";

test("prepares message content and attaches files to the first payload", async () => {
  await expect(prepareSenderPayloads({ content: "answer", files: ["image"] })).resolves.toEqual([
    { content: "answer", files: ["image"] },
  ]);
});

test("leaves prepared payloads without files", async () => {
  await expect(prepareSenderPayloads({ content: "answer" })).resolves.toEqual(["answer"]);
});

test("keeps files when a response has no text payload", async () => {
  await expect(prepareSenderPayloads({ files: ["image"] })).resolves.toEqual([
    { files: ["image"] },
  ]);
});
