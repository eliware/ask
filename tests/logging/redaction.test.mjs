import { defaultRedactPatterns, redactStringField } from "../../src/logging/redaction.mjs";

test("redacts matching string fields and preserves other values", () => {
  expect(redactStringField("ImageData", "secret", defaultRedactPatterns)).toBe(
    "<<redacted imagedata length=6>>",
  );
  expect(redactStringField("label", "visible", ["secret"])).toBeUndefined();
  expect(redactStringField("secret", 4, ["secret"])).toBeUndefined();
});
