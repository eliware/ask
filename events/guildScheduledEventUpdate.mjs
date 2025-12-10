// events/guildScheduledEventUpdate.mjs
export default async function ({ log }, oldGuildScheduledEvent, newGuildScheduledEvent) {
    log.debug('guildScheduledEventUpdate', { oldGuildScheduledEvent, newGuildScheduledEvent });
}
