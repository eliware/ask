import { jest } from "@jest/globals";
import { buildConversationInput } from "../../src/conversation/input.mjs";

const log = { debug: jest.fn() };

beforeEach(() => log.debug.mockClear());

test("builds system, prior messages, and query input", async () => {
  const interaction = {
    channel: {
      messages: {
        fetch: jest.fn(
          async () => new Map([["1", { content: "prior reply", author: { id: "bot" } }]]),
        ),
      },
    },
  };
  const input = await buildConversationInput({
    client: { user: { id: "bot" } },
    interaction,
    channelId: "c",
    query: "new",
    locale: "en-US",
    log,
  });

  expect(input).toEqual([
    input[0],
    { role: "assistant", content: [{ type: "output_text", text: "prior reply" }] },
    { role: "user", content: [{ type: "input_text", text: "new" }] },
  ]);
  expect(input[0].content[0].text).toContain("en-US");
});
