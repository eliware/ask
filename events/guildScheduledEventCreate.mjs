// events/guildScheduledEventCreate.mjs
export default async function ({ log }, guildScheduledEvent) {
    log.debug('guildScheduledEventCreate', { guildScheduledEvent });
}
