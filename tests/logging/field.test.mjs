import { jest } from "@jest/globals";
import sanitizeObjectField from "../../src/logging/field.mjs";

const options = { maxString: 3, redactPatterns: ["secret"] };
const truncate = (value, maxString) => `${value.slice(0, maxString)}...`;

test("redacts matching string fields", () => {
  expect(
    sanitizeObjectField("secret", "value", jest.fn(), new WeakSet(), 0, options, truncate),
  ).toMatch(/redacted/);
});

test("truncates long string fields", () => {
  expect(sanitizeObjectField("name", "long", jest.fn(), new WeakSet(), 0, options, truncate)).toBe(
    "lon...",
  );
});

test("sanitizes other values and reports field errors", () => {
  const sanitize = jest.fn((value) => value);
  expect(sanitizeObjectField("name", 4, sanitize, new WeakSet(), 1, options, truncate)).toBe(4);
  expect(sanitize).toHaveBeenCalledWith(4, expect.any(WeakSet), 2);
  expect(
    sanitizeObjectField(
      "name",
      4,
      () => {
        throw new Error("broken");
      },
      new WeakSet(),
      0,
      options,
      truncate,
    ),
  ).toContain("error serializing");
});

test("reports redaction evaluation errors", () => {
  expect(
    sanitizeObjectField(
      "secret",
      "value",
      jest.fn(),
      new WeakSet(),
      0,
      {
        maxString: 3,
        redactPatterns: {
          some: () => {
            throw new Error("broken");
          },
        },
      },
      truncate,
    ),
  ).toContain("error serializing");
});
