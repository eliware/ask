// events/messageCreate.mjs
export default async function ({ client, log, msg }, message) {
    log.debug('messageCreate', { id: message.id });
    const locale = message.guild?.preferredLocale || 'en-US';
    if (message.author.id === client.user.id) return;
    if (message.content === '!help') {
        const response = msg(locale, 'help', 'This is the help text.');
        await message.reply(response);
        log.debug('!help Response', { response });
    }
}