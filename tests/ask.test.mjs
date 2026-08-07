import ask from '../commands/ask.mjs';

const log = { debug() {}, error() {} };
const makeInteraction = (query = 'hello', overrides = {}) => ({
  locale: 'en-US', options: { getString: () => query }, user: { id: 'u', username: 'user' },
  channelId: 'c', channel: { id: 'c' }, guildId: 'g', guild: { id: 'g', preferredLocale: 'en-US' },
  reply: async () => {}, deferReply: async () => {}, editReply: async () => {}, ...overrides,
});
const openai = (response = { output_text: 'answer', usage: {} }) => ({ responses: { create: async () => response } });
const throwingOpenai = error => ({ responses: { create: async () => { throw error; } } });
const db = { execute: async () => [[{ cnt: 0 }]] };

test('handles missing query', async () => {
  const interaction = makeInteraction(null); let replied;
  interaction.reply = async value => { replied = value; };
  await ask({ client: null, log, msg: () => 'help', openai: {}, db: null }, interaction);
  expect(replied.content).toBe('help');
});

test('handles rate limit violation', async () => {
  const interaction = makeInteraction(); let replied;
  interaction.reply = async value => { replied = value; };
  const limitedDb = { execute: async () => [[{ cnt: 50 }]] };
  await ask({ client: null, log, msg: () => 'help', openai: {}, db: limitedDb }, interaction);
  expect(replied.content).toMatch(/Rate limit exceeded/);
});

test('continues after rate-limit failure and defer failure', async () => {
  const interaction = makeInteraction(); let replied;
  interaction.deferReply = async () => { throw new Error('defer'); };
  interaction.reply = async value => { replied = value; };
  const failingDb = { execute: async () => { throw new Error('db'); } };
  await ask({ client: null, log, msg: () => 'help', openai: openai(), db: failingDb }, interaction);
  expect(replied.content).toBe('> answer');
});

test('handles successful deferred response', async () => {
  const interaction = makeInteraction(); let edited;
  interaction.editReply = async value => { edited = value; };
  await ask({ client: null, log, msg: () => 'help', openai: openai(), db }, interaction);
  expect(edited.content).toBe('> answer');
});

test('handles array safety violations', async () => {
  const interaction = makeInteraction(); let edited;
  interaction.editReply = async value => { edited = value; };
  await ask({ client: null, log, msg: () => 'help', openai: throwingOpenai({ error: { safety_violations: ['x'] } }), db: null }, interaction);
  expect(edited.content).toMatch(/\(x\)/);
});

test('handles encoded safety violations and reply failure', async () => {
  const interaction = makeInteraction();
  interaction.deferReply = async () => { throw new Error('defer'); };
  interaction.reply = async () => { throw new Error('reply'); };
  await ask({ client: null, log, msg: () => 'help', openai: throwingOpenai(new Error('safety_violations=[x,y]')), db: null }, interaction);
});

test('handles ordinary provider error', async () => {
  const interaction = makeInteraction(); let replied;
  interaction.deferReply = async () => { throw new Error('defer'); };
  interaction.reply = async value => { replied = value; };
  await ask({ client: null, log, msg: () => 'help', openai: throwingOpenai(new Error('oops')), db: null }, interaction);
  expect(replied.content).toMatch(/content policy/);
});

test('handles null provider errors', async () => { const interaction = makeInteraction(); interaction.deferReply = async () => { throw new Error('defer'); }; interaction.reply = async () => {}; await ask({ client: null, log, msg: () => 'help', openai: throwingOpenai(null), db: null }, interaction); });
