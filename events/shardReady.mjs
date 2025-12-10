// events/shardReady.mjs
export default async function ({ log }, id, unavailableGuilds) {
    log.debug('shardReady', { id, unavailableGuilds });
}
