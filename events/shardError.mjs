// events/shardError.mjs
export default async function ({ log }, error, shardId) {
    log.debug('shardError', { error, shardId });
}
