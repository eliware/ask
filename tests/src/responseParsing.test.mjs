import { decodeBase64Image, normalizeOutputs, parseResponse } from '../../src/responseParsing.mjs';

test('decodeBase64Image decodes and returns null on invalid input', () => {
  expect(decodeBase64Image('aGVsbG8=')).toEqual(Buffer.from('hello'));
  expect(decodeBase64Image(Symbol('bad'))).toBeNull();
  expect(decodeBase64Image('bad')).toBeNull();
  const from = Buffer.from;
  Buffer.from = () => { throw new Error('bad buffer'); };
  expect(decodeBase64Image('aGVsbG8=')).toBeNull();
  Buffer.from = from;
});

test('normalizeOutputs handles arrays, objects, and missing values', () => {
  const array = [{ content: 'a' }];
  expect(normalizeOutputs({ outputs: array })).toBe(array);
  expect(normalizeOutputs({ output: array })).toBe(array);
  expect(normalizeOutputs({ outputs: { a: 1, b: 2 } })).toEqual([1, 2]);
  expect(normalizeOutputs({ output: { a: 3, b: 4 } })).toEqual([3, 4]);
  expect(normalizeOutputs({ outputs: 'no', output: null })).toEqual([]);
  expect(normalizeOutputs(null)).toEqual([]);
});

test('parseResponse handles generation images and all content forms', () => {
  const result = parseResponse({ outputs: [
    { type: 'image_generation_call', id: 'ig_call', result: 'aGVsbG8=', revised_prompt: 'rev' },
    { id: 'ig_1', result: 'aGVsbG8=' },
    { type: 'image_generation_call', result: 'bad' },
    { type: 'image_generation_call', result: 'aGVsbG8=' },
    { type: 'image_generation_call', result: 'aGVsbG8=' },
    { id: 'not_ig', result: 'aGVsbG8=' },
    { content: [
      'plain',
      { text: 'text' },
      { output_text: 'output' },
      { content: 'content' },
      { text: 'x', b64_json: 'aGVsbG8=', filename: 'x.jpg', mime: 'image/jpeg', description: 'desc' },
      { base64: 'aGVsbG8=' },
      { image: { b64: 'aGVsbG8=' } },
      { image: { b64_json: 'aGVsbG8=' } },
      { image: { base64: 'aGVsbG8=' } },
      { image: { url: 'https://a' } },
      { url: 'https://b' },
      { src: 'https://c' },
      { href: 'https://d', filename: 'd', description: 'D' },
      { text: 1, b64_json: '', url: '' },
      { b64_json: 'bad' },
    ] },
    { content: { one: { text: 'object' } } },
    { content: 'string' },
    { data: [{ text: 'data-array' }] },
    { data: { one: { text: 'data-object' } } },
    'output-string',
    { content: null },
    null,
  ] });
  expect(result.replyText).toBe('plain\ntext\noutput\ncontent\nx\nobject\nstring\ndata-array\ndata-object\noutput-string');
  expect(result.images).toHaveLength(13);
  expect(result.images[0]).toMatchObject({ buffer: Buffer.from('hello'), description: 'rev' });
  expect(result.images[1]).toMatchObject({ buffer: Buffer.from('hello') });
  expect(result.images).toEqual(expect.arrayContaining([expect.objectContaining({ filename: 'x.jpg', mime: 'image/jpeg' })]));
});

test('parseResponse uses fallback text', () => {
  expect(parseResponse({ output_text: 'fallback' })).toEqual({ replyText: 'fallback', images: [] });
  expect(parseResponse({ text: 'text fallback' })).toEqual({ replyText: 'text fallback', images: [] });
  expect(parseResponse({})).toEqual({ replyText: '', images: [] });
});
