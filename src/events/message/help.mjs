export async function replyWithLocalizedHelp({ log, msg }, message, locale) {
  const response = msg(locale, "help", "This is the help text.", log);
  await message.reply(response);
  log.debug("!help Response", { response });
}
