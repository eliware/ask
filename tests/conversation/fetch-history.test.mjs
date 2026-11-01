import { expect, jest, test } from "@jest/globals";
import { fetchConversationHistory } from "../../src/conversation/fetch-history.mjs";

test("skips client lookup when no channel ID is available", async () => {
  const fetchChannel = jest.fn();
  const history = await fetchConversationHistory({
    client: { channels: { fetch: fetchChannel } },
    interaction: {},
    channelId: "",
    log: { debug: jest.fn() },
  });

  expect(history).toEqual([]);
  expect(fetchChannel).not.toHaveBeenCalled();
});
