import { safeSerialize } from "@eliware/common";

export function createMessageReplyMethods({ send, stopTyping, log }) {
  return {
    reply: async (response) => {
      stopTyping();
      try {
        await send(response, Boolean(response?.flags & (1 << 6)));
      } catch (error) {
        log.error("mock interaction.reply failed", { error: safeSerialize(error) });
      }
    },
    editReply: async (response) => {
      stopTyping();
      try {
        await send(response);
      } catch (error) {
        log.error("mock interaction.editReply failed", { error: safeSerialize(error) });
      }
    },
  };
}
