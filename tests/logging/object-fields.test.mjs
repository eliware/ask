import sanitizeForLog from "../../src/logging/sanitize-for-log.mjs";

test("limits object fields", () => {
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
