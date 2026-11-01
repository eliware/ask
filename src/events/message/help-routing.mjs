export async function routeMessageHelp({ log, msg }, message, locale) {
  if (message.content !== "!help") return false;
  const response = msg(locale, "help", "This is the help text.", log);
  await message.reply(response);
  log.debug("!help Response", { response });
  return true;
}
