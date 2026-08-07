import sanitizeForLog from '../../src/sanitizeForLog.mjs';

test('handles primitives and depth limits', () => {
  expect(sanitizeForLog(null)).toBeNull();
  expect(sanitizeForLog(undefined)).toBeUndefined();
  expect(sanitizeForLog(3)).toBe(3);
  expect(sanitizeForLog(false)).toBe(false);
  expect(sanitizeForLog({ deep: { value: 1 } }, new WeakSet(), 6)).toBe('<<max-depth>>');
  expect(sanitizeForLog(() => {})).toBe('() => {}');
});
test('sanitizes strings and binary values', () => {
  expect(sanitizeForLog(Buffer.from('x'))).toBe('[Buffer length=1]');
  expect(sanitizeForLog('plain')).toBe('plain');
  expect(sanitizeForLog('\u0000'.repeat(2))).toMatch(/nonprintable/);
  expect(sanitizeForLog('x'.repeat(20), new WeakSet(), 0, { maxString: 10 })).toMatch(/truncated/);
});
test('limits and detects circular arrays', () => {
  const circular = []; circular.push(circular);
  expect(sanitizeForLog(circular)[0]).toBe('<<circular>>');
  expect(sanitizeForLog([1, 2, 3], new WeakSet(), 0, { maxArray: 2 })).toEqual([1, 2, '<<1 more items...>>']);
});
test('redacts, truncates, and limits object fields', () => {
  const value = { token: 'secret', image: 'abc', custom: 'secret', long: 'x'.repeat(20) };
  expect(sanitizeForLog(value, new WeakSet(), 0, { maxString: 10, redactPatterns: ['custom'] })).toMatchObject({ token: expect.stringContaining('secret'), image: expect.stringContaining('abc'), custom: expect.stringContaining('redacted'), long: expect.stringContaining('truncated') });
  const many = {}; for (let i = 0; i < 3; i++) many[`k${i}`] = i;
  expect(sanitizeForLog(many, new WeakSet(), 0, { maxEntries: 2 }).__more).toMatch(/truncated/);
});
test('handles circular objects and throwing getters', () => {
  const circular = {}; circular.self = circular;
  expect(sanitizeForLog(circular).self).toBe('<<circular>>');
  const value = {}; Object.defineProperty(value, 'bad', { enumerable: true, get: () => { throw new Error('bad'); } });
  expect(sanitizeForLog(value)).toMatch(/error serializing/);
});
test('handles redaction evaluation errors', () => {
  const value = { secret: 'value' };
  const opts = { redactPatterns: { some: () => { throw new Error('redact'); } } };
  expect(sanitizeForLog(value, new WeakSet(), 0, opts).secret).toMatch(/error serializing/);
});
test('accepts null options', () => { expect(sanitizeForLog('ok', new WeakSet(), 0, null)).toBe('ok'); });
