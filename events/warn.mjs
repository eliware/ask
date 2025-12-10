// events/warn.mjs
export default async function ({ log }, warn) {
    log.warn('warn', { warn });
}
