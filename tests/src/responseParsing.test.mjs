import { decodeBase64Image, normalizeOutputs, parseResponse } from '../../src/responseParsing.mjs';
test('decodes images and parses text, base64, and URLs', () => {
  expect(decodeBase64Image('aGVsbG8=')).toEqual(Buffer.from('hello'));
  expect(normalizeOutputs({ output: [{ content: [{ text: 'hi' }] }] })).toHaveLength(1);
  expect(parseResponse({ output: [{ content: [{ text: 'hi', b64_json: 'aGVsbG8=' }, { url: 'https://x.test/a.png' }] }] })).toMatchObject({ replyText: 'hi', images: [{ buffer: Buffer.from('hello') }, { url: 'https://x.test/a.png' }] });
});
