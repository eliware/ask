// events/roleUpdate.mjs
export default async function ({ log }, oldRole, newRole) {
    log.debug('roleUpdate', { oldRole, newRole });
}
