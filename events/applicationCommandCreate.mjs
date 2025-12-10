// events/applicationCommandCreate.mjs
export default async function ({ log }, ...args) {
    log.debug('applicationCommandCreate', { args });
}
