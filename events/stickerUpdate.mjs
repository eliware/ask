// events/stickerUpdate.mjs
export default async function ({ log }, oldSticker, newSticker) {
    log.debug('stickerUpdate', { oldSticker, newSticker });
}
