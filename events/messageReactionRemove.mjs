// events/messageReactionRemove.mjs
export default async function ({ log }, reaction, user) {
    log.debug('messageReactionRemove', { reaction, user });
}
