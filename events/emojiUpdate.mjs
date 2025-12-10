// events/emojiUpdate.mjs
export default async function ({ log }, oldEmoji, newEmoji) {
    log.debug('emojiUpdate', { oldEmoji, newEmoji });
}
