// events/presenceUpdate.mjs
export default async function ({ log }, oldPresence, newPresence) {
    log.debug('presenceUpdate', { oldPresence, newPresence });
}
