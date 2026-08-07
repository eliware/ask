import { addBlockquote, defaultSplit, safetyMessage } from '../../src/formatResponse.mjs';
test('formats replies and splits text', () => {
  expect(addBlockquote('a\n\nb')).toBe('> a\n> \n> b');
  expect(defaultSplit('abcdef', 2)).toEqual(['ab', 'cd', 'ef']);
  expect(safetyMessage([])).toMatch(/content policy/);
  expect(safetyMessage(['x'])).toMatch(/\(x\)/);
});
