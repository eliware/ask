// events/guildMemberRemove.mjs
export default async function ({ log }, member) {
    log.debug('guildMemberRemove', { member });
}
