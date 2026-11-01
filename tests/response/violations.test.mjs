import { extractViolations } from "../../src/response/violations.mjs";

test("parses safety violations from provider objects", () => {
  expect(extractViolations({ error: { safety_violations: ["one", 2] } })).toEqual(["one", "2"]);
});

test("parses safety violations from encoded errors", () => {
  expect(extractViolations(new Error("safety_violations=[one, , two]"))).toEqual(["one", "two"]);
});

test("returns no violations for other errors", () => {
  expect(extractViolations(new Error("other failure"))).toEqual([]);
});
