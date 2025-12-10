// events/guildUpdate.mjs
export default async function ({ log }, oldGuild, newGuild) {
    log.debug('guildUpdate', { oldGuild, newGuild });
}
