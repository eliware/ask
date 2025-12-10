// events/threadMemberUpdate.mjs
export default async function ({ log }, oldMember, newMember) {
    log.debug('threadMemberUpdate', { oldMember, newMember });
}
