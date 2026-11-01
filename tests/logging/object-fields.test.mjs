import sanitizeForLog from "../../src/logging/sanitize-for-log.mjs";

test("redacts, truncates, and limits object fields", () => {
  const value = { token: "secret", image: "abc", custom: "secret", long: "x".repeat(20) };
  expect(
    sanitizeForLog(value, new WeakSet(), 0, { maxString: 10, redactPatterns: ["custom"] }),
  ).toMatchObject({
    token: expect.stringContaining("secret"),
    image: expect.stringContaining("abc"),
    custom: expect.stringContaining("redacted"),
    long: expect.stringContaining("truncated"),
  });
  const many = {};
  for (let i = 0; i < 3; i++) many[`k${i}`] = i;
  expect(sanitizeForLog(many, new WeakSet(), 0, { maxEntries: 2 }).__more).toMatch(/truncated/);
});

test("handles throwing getters and redaction evaluation errors", () => {
  const value = {};
  Object.defineProperty(value, "bad", {
    enumerable: true,
    get: () => {
      throw new Error("bad");
    },
  });
  expect(sanitizeForLog(value)).toMatch(/error serializing/);

  const opts = {
    redactPatterns: {
      some: () => {
        throw new Error("redact");
      },
    },
  };
  expect(sanitizeForLog({ secret: "value" }, new WeakSet(), 0, opts).secret).toMatch(
    /error serializing/,
  );
});

test("handles object entry enumeration errors", () => {
  const value = new Proxy(
    {},
    {
      ownKeys: () => {
        throw new Error("keys");
      },
    },
  );
  expect(sanitizeForLog(value)).toMatch(/error serializing/);
});
