import { deliverResponse } from '../../src/responseDelivery.mjs';

const log = { debug() {} };
test('delivers mock response with files and URLs', async () => {
  let sent;
  const interaction = { _omitBlockquote: true, reply: async value => { sent = value; } };
  await deliverResponse(interaction, 'ok', [{ buffer: Buffer.from('x'), filename: 'x.png' }, { url: 'https://x.test/a' }], false, log);
  expect(sent).toMatchObject({ content: 'ok\n\nhttps://x.test/a', files: [{ name: 'x.png' }] });
});
test('edits deferred mock response', async () => {
  let edited;
  const interaction = { _omitBlockquote: true, editReply: async value => { edited = value; } };
  await deliverResponse(interaction, '', [], true, log);
  expect(edited).toEqual({});
});
test('delivers real response, attachments, URLs, and followups', async () => {
  const calls = []; const interaction = { reply: async value => calls.push(['reply', value]), followUp: async value => calls.push(['follow', value]) };
  await deliverResponse(interaction, 'a'.repeat(5000), [{ buffer: Buffer.from('x'), filename: 'x' }, { url: 'https://x.test/a' }], false, log);
  expect(calls[0][1].files).toBeDefined(); expect(calls.some(([type]) => type === 'follow')).toBe(true);
});
test('falls back to reply for followups and logs failures', async () => {
  const calls = []; const interaction = { reply: async value => calls.push(value) };
  await deliverResponse(interaction, 'a'.repeat(5000), [], false, log);
  expect(calls.length).toBeGreaterThan(1);
  let first = true; const failing = { reply: async () => { if (first) { first = false; return; } throw new Error('fail'); }, followUp: async () => { throw new Error('fail'); } };
  await deliverResponse(failing, 'a'.repeat(5000), [], false, log);
});
test('delivers attachment-only and deferred empty responses', async () => {
  let sent; const interaction = { reply: async value => { sent = value; } };
  await deliverResponse(interaction, '', [{ buffer: Buffer.from('x'), filename: 'x' }], false, log);
  expect(sent.files).toBeDefined();
  let edited; await deliverResponse({ editReply: async value => { edited = value; } }, '', [], true, log);
  expect(edited.content).toMatch(/could not generate/);
});
test('covers deferred real delivery and URL-only output', async () => {
  let edited; const interaction = { editReply: async value => { edited = value; }, followUp: async () => {} };
  await deliverResponse(interaction, 'short', [{ url: 'https://x.test/a' }, {}], true, log);
  expect(edited.content).toContain('https://x.test/a');
  let sent; await deliverResponse({ reply: async value => { sent = value; } }, '', [{ url: 'https://x.test/a' }], false, log);
  expect(sent.content).toBe('https://x.test/a');
});
test('covers mock empty and real attachment URL combinations', async () => {
  let sent; await deliverResponse({ _omitBlockquote: true, reply: async value => { sent = value; } }, '', [{ url: 'u' }], false, log);
  expect(sent.content).toBe('u');
  let edited; await deliverResponse({ editReply: async value => { edited = value; } }, '', [{ url: 'u' }], true, log);
  expect(edited.content).toBe('u');
});

test('stringifies follow-up errors without messages', async () => { let first = true; const interaction = { reply: async () => { if (first) { first = false; return; } }, followUp: async () => { throw 'broken'; } }; await deliverResponse(interaction, 'a'.repeat(5000), [], false, { debug: (...args) => { expect(args[1].error).toBe('broken'); } }); });
