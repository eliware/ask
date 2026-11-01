// events/invalidated.mjs
export default async function ({ log, healthServer }) {
  healthServer?.setReady(false);
  log.debug("invalidated");
}
