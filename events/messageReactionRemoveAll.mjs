// events/messageReactionRemoveAll.mjs
export default async function ({ log }, message, reactions) {
    log.debug('messageReactionRemoveAll', { message, reactions });
}
