// events/messageUpdate.mjs
export default async function ({ log }, oldMessage, newMessage) {
    log.debug('messageUpdate', { oldMessage, newMessage });
}
