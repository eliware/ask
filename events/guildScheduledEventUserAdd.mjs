// events/guildScheduledEventUserAdd.mjs
export default async function ({ log }, guildScheduledEvent, user) {
    log.debug('guildScheduledEventUserAdd', { guildScheduledEvent, user });
}
