// events/threadUpdate.mjs
export default async function ({ log }, oldThread, newThread) {
    log.debug('threadUpdate', { oldThread, newThread });
}
