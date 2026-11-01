import { safeSerialize } from "@eliware/common";
import { createMessageInteraction } from "../interaction/message.mjs";

export default async function ({ client, log, msg, commandHandlers, ...contextData }, message) {
  log.debug("messageCreate", { id: message.id });
  if (message.author?.bot) return;
  const locale = message.guild?.preferredLocale || "en-US";
  const localeMsg = (key, defaultMsg) => msg(locale, key, defaultMsg, log);
  if (message.content === "!help") {
    const response = localeMsg("help", "This is the help text.");
    await message.reply(response);
    log.debug("!help Response", { response });
    return;
  }

  const isDirect = !message.guild;
  const isMentioned = message.mentions?.has?.(client.user) || false;
  const namePattern = /^\s*ask(?:\b\s*[,!:]?\s*|$)/i;
  const messageContent = message.content || "";
  const isAddressedByName = namePattern.test(messageContent);
  let isReplyToBot = false;
  try {
    const referenceId = message.reference?.messageId || message.reference?.message?.id;
    if (referenceId) {
      const referencePromise = message.fetchReference
        ? message.fetchReference()
        : message.channel?.messages?.fetch
          ? message.channel.messages.fetch(referenceId)
          : null;
      const reference = await Promise.resolve(referencePromise).catch(() => null);
      isReplyToBot = reference?.author?.id === client.user?.id;
    }
  } catch (error) {
    log.debug("failed to resolve referenced message", { error: safeSerialize(error) });
  }
  if (!isDirect && !isMentioned && !isReplyToBot && !isAddressedByName) return;

  const mentionPattern = /<@!?[\w-]+>|<@&[\w-]+>|<#\w+>/g;
  const addressedText = isAddressedByName
    ? messageContent.replace(namePattern, "")
    : messageContent;
  const text = addressedText.replace(mentionPattern, "").trim() || "Hello!";
  const interaction = createMessageInteraction({ client, message, locale, text, log });
  try {
    let handler = commandHandlers?.ask;
    if (!handler) handler = (await import("../commands/ask.mjs")).default;
    if (handler) await handler({ client, log, msg: localeMsg, ...contextData }, interaction);
    else
      await interaction.reply({
        content: localeMsg("help", "Try /ask <anything>."),
        flags: 1 << 6,
      });
  } catch (error) {
    log.error("messageCreate handler invocation failed", {
      error: safeSerialize(error),
      stack: error?.stack,
    });
  } finally {
    interaction.stopTyping();
  }
}
