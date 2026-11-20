import { safeSerialize } from "@eliware/common";
import createMessageInteraction from "../interaction/message.mjs";
import __addressingModule from "./message/addressing.mjs";
const { isAddressedByName } = __addressingModule;
import isMessageTriggered from "./message/triggers.mjs";
import extractMessagePrompt from "./message/prompt.mjs";
import routeMessageHelp from "./message/help-routing.mjs";
import isReplyToBot from "./message/reply-detection.mjs";

export default async function ({ client, log, msg, commandHandlers, ...contextData }, message) {
  log.debug("messageCreate", { id: message.id });
  if (message.author?.bot) return;
  const locale = message.guild?.preferredLocale || "en-US";
  const localeMsg = (key, defaultMsg) => msg(locale, key, defaultMsg, log);
  if (await routeMessageHelp({ log, msg }, message, locale)) return;

  const isDirect = !message.guild;
  const isMentioned = message.mentions?.has?.(client.user) || false;
  const messageContent = message.content || "";
  const addressedByName = isAddressedByName(messageContent);
  const replyingToBot = await isReplyToBot(message, client, log);
  if (!isMessageTriggered({ isDirect, isMentioned, isReplyToBot: replyingToBot, addressedByName }))
    return;

  const text = extractMessagePrompt(messageContent, addressedByName);
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
