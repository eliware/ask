import { jest } from "@jest/globals";
import { createTypingManager } from "../../src/interaction/typing.mjs";

test("starts, refreshes, and stops typing while handling failures", async () => {
  jest.useFakeTimers();
  const sendTyping = jest
    .fn()
    .mockRejectedValueOnce(new Error("initial"))
    .mockImplementation(() => {
      throw new Error("refresh");
    });
  const typing = createTypingManager({ sendTyping });

  await typing.start();
  jest.advanceTimersByTime(8000);
  await Promise.resolve();
  typing.stop();
  expect(sendTyping).toHaveBeenCalledTimes(2);

  jest.useRealTimers();
});

test("supports a missing channel", async () => {
  const typing = createTypingManager(undefined);
  await typing.start();
  typing.stop();
});
