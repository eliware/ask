import { requestAnswer } from '../../src/openaiRequest.mjs';
test('sends the configured Responses API request', async () => { const openai = { responses: { create: async request => ({ request }) } }; const result = await requestAnswer(openai, []); expect(result.request.model).toBe('gpt-5.6-luna'); });
