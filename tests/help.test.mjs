import help from '../commands/help.mjs';

test('replies with localized ephemeral help', async () => {
  const calls = [];
  const log = { debug: (...args) => calls.push(args) };
  const interaction = { reply: async response => calls.push(['reply', response]) };
  await help({ log, msg: (scope, key, fallback) => `${scope}:${key}:${fallback}` }, interaction);
  const response = calls.find(([name]) => name === 'reply')[1];
  expect(response.flags).toBe(64);
  expect(response.content).toMatch(/^help:Try \/ask/);
  expect(calls.filter(([name]) => name === 'help Request').length).toBe(1);
  expect(calls.filter(([name]) => name === 'help Response').length).toBe(1);
});
