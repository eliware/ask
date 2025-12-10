// events/messageReactionRemoveEmoji.mjs
export default async function ({ log }, reaction) {
    log.debug('messageReactionRemoveEmoji', { reaction });
}
