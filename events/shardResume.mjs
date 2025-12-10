// events/shardResume.mjs
export default async function ({ log }, id, replayedEvents) {
    log.debug('shardResume', { id, replayedEvents });
}
