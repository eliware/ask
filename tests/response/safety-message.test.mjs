import { safetyMessage } from "../../src/response/safety-message.mjs";

test("formats safety messages with and without violations", () => {
  expect(safetyMessage()).toMatch(/content policy/);
  expect(safetyMessage([])).toMatch(/content policy/);
  expect(safetyMessage(["x", "y"])).toMatch(/\(x, y\)/);
});
