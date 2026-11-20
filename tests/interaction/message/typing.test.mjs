import { expect, jest, test } from "@jest/globals";
import setupMessageTyping from "../../../src/interaction/message/typing.mjs";

test("adds typing methods to a message interaction", async () => {
  jest.useFakeTimers();
  const channel = { sendTyping: jest.fn() };
  const interaction = {};
  setupMessageTyping(interaction, channel);

  await interaction.deferReply();
  expect(channel.sendTyping).toHaveBeenCalledTimes(1);
  expect(typeof interaction.stopTyping).toBe("function");
  interaction.stopTyping();
  expect(jest.getTimerCount()).toBe(0);
  jest.useRealTimers();
});
