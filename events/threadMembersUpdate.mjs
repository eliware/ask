// events/threadMembersUpdate.mjs
export default async function ({ log }, addedMembers, removedMembers) {
    log.debug('threadMembersUpdate', { addedMembers, removedMembers });
}
