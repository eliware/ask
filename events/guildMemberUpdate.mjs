// events/guildMemberUpdate.mjs
export default async function ({ log }, oldMember, newMember) {
    log.debug('guildMemberUpdate', { oldMember, newMember });
}
