// events/guildMemberAvailable.mjs
export default async function ({ log }, member) {
    log.debug('guildMemberAvailable', { member });
}
