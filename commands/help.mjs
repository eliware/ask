// commands/help.mjs
export default async function ({ log, msg }, interaction) {
    log.debug('help Request', { interaction });
    const response = {
        content: msg('help', "Try /ask <anything>. You can use /ask in server channels, group DMs, or directly in DMs with the app. Manage the app: https://discord.com/oauth2/authorize?client_id=1460830876345569372"),
        flags: 1 << 6, // EPHEMERAL
    };
    log.debug('help Response', { response });
    await interaction.reply(response);
}
