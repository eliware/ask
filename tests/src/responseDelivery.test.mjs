import { deliverResponse } from '../../src/responseDelivery.mjs';
test('delivers mock interaction responses', async () => { const interaction = { _omitBlockquote: true, reply: async message => message }; await expect(deliverResponse(interaction, 'ok', [], false, { debug() {} })).resolves.toEqual({ content: 'ok' }); });
