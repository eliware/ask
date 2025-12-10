// events/guildUnavailable.mjs
export default async function ({ log }, guild) {
    log.debug('guildUnavailable', { guild });
}
