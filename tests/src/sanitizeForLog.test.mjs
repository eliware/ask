import sanitizeForLog from '../../src/sanitizeForLog.mjs';
test('sanitizes sensitive, large, circular, and binary values', () => {
  const circular = {}; circular.self = circular;
  expect(sanitizeForLog({ token: 'secret', image: 'abc' })).toMatchObject({ token: 'secret', image: expect.stringContaining('redacted') });
  expect(sanitizeForLog(Buffer.from('x'))).toBe('[Buffer length=1]');
  expect(sanitizeForLog(circular).self).toBe('<<circular>>');
  expect(sanitizeForLog('x'.repeat(20), new WeakSet(), 0, { maxString: 10 })).toMatch(/truncated/);
});
