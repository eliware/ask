// events/error.mjs
export default async function ({ log }, error) {
    log.error('error', { error });
}
