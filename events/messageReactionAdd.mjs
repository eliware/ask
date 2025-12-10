// events/messageReactionAdd.mjs
export default async function ({ log }, reaction, user) {
    log.debug('messageReactionAdd', { reaction, user });
}
