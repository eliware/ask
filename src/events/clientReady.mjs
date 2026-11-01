// events/clientReady.mjs
export default async function ({ log, presence, healthServer }, client) {
  healthServer?.setReady(true);
  log.debug("ready", { tag: client.user.tag });
  log.info(`Logged in as ${client.user.tag}`);
  if (presence) client.user.setPresence(presence);
}
