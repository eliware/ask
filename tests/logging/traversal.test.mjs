import sanitizeForLog from "../../src/logging/sanitize-for-log.mjs";

test("limits and detects circular arrays", () => {
  const circular = [];
  circular.push(circular);
  expect(sanitizeForLog(circular)[0]).toBe("<<circular>>");
  expect(sanitizeForLog([1, 2, 3], new WeakSet(), 0, { maxArray: 2 })).toEqual([
    1,
    2,
    "<<1 more items...>>",
  ]);
});

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

test("handles circular objects and throwing getters", () => {
  const circular = {};
  circular.self = circular;
  expect(sanitizeForLog(circular).self).toBe("<<circular>>");
  const value = {};
  Object.defineProperty(value, "bad", {
    enumerable: true,
    get: () => {
      throw new Error("bad");
    },
  });
  expect(sanitizeForLog(value)).toMatch(/error serializing/);
});

test("handles redaction evaluation errors", () => {
  const value = { secret: "value" };
  const opts = {
    redactPatterns: {
      some: () => {
        throw new Error("redact");
      },
    },
  };
  expect(sanitizeForLog(value, new WeakSet(), 0, opts).secret).toMatch(/error serializing/);
});

test("handles array item serialization errors", () => {
  const value = [];
  Object.defineProperty(value, 0, {
    enumerable: true,
    get: () => {
      throw new Error("index");
    },
  });
  value.length = 1;
  expect(sanitizeForLog(value)[0]).toMatch(/error serializing index 0/);
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
