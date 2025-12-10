// events/shardDisconnect.mjs
export default async function ({ log }, event, id) {
    log.debug('shardDisconnect', { event, id });
}
