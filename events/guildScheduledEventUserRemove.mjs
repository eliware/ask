// events/guildScheduledEventUserRemove.mjs
export default async function ({ log }, guildScheduledEvent, user) {
    log.debug('guildScheduledEventUserRemove', { guildScheduledEvent, user });
}
