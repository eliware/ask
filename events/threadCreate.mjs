// events/threadCreate.mjs
export default async function ({ log }, thread) {
    log.debug('threadCreate', { thread });
}
