import { checkRateLimit } from '../../src/rateLimit.mjs';
test('checks configured limits', async () => { const db = { execute: async () => [[{ cnt: 50 }]] }; await expect(checkRateLimit(db, { userId: 'u' })).resolves.toHaveLength(1); });
