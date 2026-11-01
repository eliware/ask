import { normalizeLogValue } from "../../src/logging/values.mjs";

test("normalizes primitive and binary log values", () => {
  expect(normalizeLogValue(null, 10)).toEqual({ handled: true, value: null });
  expect(normalizeLogValue(undefined, 10)).toEqual({ handled: true, value: undefined });
  expect(normalizeLogValue(3, 10)).toEqual({ handled: true, value: 3 });
  expect(normalizeLogValue(false, 10)).toEqual({ handled: true, value: false });
  expect(normalizeLogValue(Buffer.from("x"), 10)).toEqual({
    handled: true,
    value: "[Buffer length=1]",
  });
  expect(normalizeLogValue(() => {}, 10)).toEqual({ handled: true, value: "() => {}" });
});

test("sanitizes and truncates string log values", () => {
  expect(normalizeLogValue("plain", 10)).toEqual({ handled: true, value: "plain" });
  expect(normalizeLogValue("\u0000".repeat(2), 10).value).toMatch(/nonprintable/);
  expect(normalizeLogValue("x".repeat(20), 10).value).toMatch(/truncated/);
});

test("leaves structured values for recursive traversal", () => {
  expect(normalizeLogValue([], 10)).toEqual({ handled: false });
  expect(normalizeLogValue({}, 10)).toEqual({ handled: false });
});
