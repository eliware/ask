import isSupportedImageUrl from "../../../src/response/images/url-validation.mjs";

test.each([
  ["https://image.test/file.png", true],
  ["http://image.test/file.png", true],
  ["javascript:alert(1)", false],
  ["file:///etc/passwd", false],
  ["not a URL", false],
  ["", false],
  [null, false],
])("validates supported image URL %s", (url, expected) => {
  expect(isSupportedImageUrl(url)).toBe(expected);
});
