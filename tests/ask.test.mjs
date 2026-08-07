import ask from '../commands/ask.mjs';

const log = { debug() {}, error() {} };
const base = () => ({ locale: 'en-US', options: { getString: () => 'hello' }, user: { id: 'u', username: 'user' }, channelId: 'c', channel: { id: 'c' }, guildId: 'g', guild: { id: 'g', preferredLocale: 'en-US' }, reply: async () => {}, deferReply: async () => {}, editReply: async () => {} });

test('handles missing query', async () => { const interaction = base(); interaction.options.getString = () => null; const reply = viReply(interaction); await ask({ client: null, log, msg: () => 'help', openai: {}, db: null }, interaction); expect(reply.called).toBe(true); });
test('handles successful response', async () => { const interaction = base(); const reply = viReply(interaction); await ask({ client: null, log, msg: () => 'help', openai: { responses: { create: async () => ({ output_text: 'answer', usage: {} }) } }, db: null }, interaction); expect(reply.called || interaction.editCalled).toBe(true); });
test('handles provider errors', async () => { const interaction = base(); const reply = viReply(interaction); await ask({ client: null, log, msg: () => 'help', openai: { responses: { create: async () => { throw new Error('safety_violations=[x]'); } } }, db: null }, interaction); expect(reply.called || interaction.editCalled).toBe(true); });
function viReply(interaction) { const original = interaction.reply; const state = { called: false }; interaction.reply = async value => { state.called = true; return original(value); }; interaction.editReply = async value => { interaction.editCalled = true; return value; }; return state; }
