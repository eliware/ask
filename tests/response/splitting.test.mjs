import defaultSplit from "../../src/response/splitting.mjs";

test("splits text at boundaries", () => {
  expect(defaultSplit("abcdef", 2)).toEqual(["ab", "cd", "ef"]);
  expect(defaultSplit("", 2)).toEqual([]);
  expect(defaultSplit("a", 5)).toEqual(["a"]);
});
