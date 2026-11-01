import { jest } from "@jest/globals";
import { createMessageInteractionFactory } from "../../../src/interaction/message/factory.mjs";

test("constructs reply and typing methods for a message interaction", async () => {
  const message = { author: {}, channel: { sendTyping: jest.fn() } };
  const interaction = createMessageInteractionFactory({
    client: {},
    message,
    locale: "en",
    text: "question",
    log: { error: jest.fn() },
  });

  await interaction.deferReply();
  expect(message.channel.sendTyping).toHaveBeenCalledTimes(1);
  expect(interaction.options.getString()).toBe("question");
  interaction.stopTyping();
});
