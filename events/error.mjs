import { safeSerialize } from '@eliware/common';
// events/error.mjs
export default async function ({ log }, error) {
    log.error('error', { error: safeSerialize(error) });
}
