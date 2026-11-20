import { safeSerialize } from "@eliware/common";

export default async function isReplyToBot(message, client, log) {
  try {
    const referenceId = message.reference?.messageId || message.reference?.message?.id;
    if (!referenceId) return false;
    const referencePromise = message.fetchReference
      ? message.fetchReference()
      : message.channel?.messages?.fetch
        ? message.channel.messages.fetch(referenceId)
        : null;
    const reference = await Promise.resolve(referencePromise).catch(() => null);
    return reference?.author?.id === client.user?.id;
  } catch (error) {
    log.debug("failed to resolve referenced message", { error: safeSerialize(error) });
    return false;
  }
}
