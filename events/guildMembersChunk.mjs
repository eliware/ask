// events/guildMembersChunk.mjs
export default async function ({ log }, members, guild, chunk) {
    log.debug('guildMembersChunk', { members, guild, chunk });
}
