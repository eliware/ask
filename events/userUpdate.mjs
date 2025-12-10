// events/userUpdate.mjs
export default async function ({ log }, oldUser, newUser) {
    log.debug('userUpdate', { oldUser, newUser });
}
