import { expect, jest, test } from "@jest/globals";
import { createHealthRequestHandler } from "../../src/health/routes.mjs";

function makeResponse() {
  return { writeHead: jest.fn(), end: jest.fn() };
}

test("answers health checks", () => {
  const response = makeResponse();
  createHealthRequestHandler(() => false)({ method: "GET", url: "/health" }, response);

  expect(response.writeHead).toHaveBeenCalledWith(200, { "content-type": "application/json" });
  expect(response.end).toHaveBeenCalledWith('{"status":"ok"}');
});

test("reports readiness from the supplied state", () => {
  const cases = [
    [false, 503, '{"status":"not ready"}'],
    [true, 200, '{"status":"ready"}'],
  ];
  for (const [ready, status, body] of cases) {
    const response = makeResponse();
    const isReady = jest.fn(() => ready);
    createHealthRequestHandler(isReady)({ method: "GET", url: "/ready" }, response);
    expect(response.writeHead).toHaveBeenCalledWith(status, { "content-type": "application/json" });
    expect(response.end).toHaveBeenCalledWith(body);
    expect(isReady).toHaveBeenCalledTimes(1);
  }
});

test("rejects unsupported methods and unknown paths", () => {
  const handler = createHealthRequestHandler(() => false);
  const methodResponse = makeResponse();
  handler({ method: "POST", url: "/health" }, methodResponse);
  expect(methodResponse.writeHead).toHaveBeenCalledWith(405, {
    "content-type": "application/json",
  });
  expect(methodResponse.end).toHaveBeenCalledWith('{"status":"method not allowed"}');

  const pathResponse = makeResponse();
  handler({ method: "GET" }, pathResponse);
  expect(pathResponse.writeHead).toHaveBeenCalledWith(404, { "content-type": "application/json" });
  expect(pathResponse.end).toHaveBeenCalledWith('{"status":"not found"}');
});
