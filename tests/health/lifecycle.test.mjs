import { expect, jest, test } from "@jest/globals";
import { createHealthServerLifecycle } from "../../src/health/lifecycle.mjs";

function makeServer() {
  let onError;
  const server = {
    listening: false,
    once: jest.fn((_event, handler) => {
      onError = handler;
    }),
    off: jest.fn(),
    listen: jest.fn((_port, _host, callback) => {
      server.listening = true;
      callback();
    }),
    close: jest.fn((callback) => {
      server.listening = false;
      callback();
    }),
    address: jest.fn(() => ({ port: 3000 })),
    fail: (error) => onError(error),
  };
  return server;
}

test.each([
  [{}, 3000, "127.0.0.1"],
  [{ host: "0.0.0.0", port: 4000 }, 4000, "0.0.0.0"],
])("starts the server with the selected host and port", async (options, port, host) => {
  const server = makeServer();
  const lifecycle = createHealthServerLifecycle(server, options);

  await lifecycle.start();

  expect(server.listen).toHaveBeenCalledWith(port, host, expect.any(Function));
  expect(server.off).toHaveBeenCalledWith("error", expect.any(Function));
  expect(lifecycle.address()).toEqual({ port: 3000 });
  await lifecycle.close();
  expect(server.close).toHaveBeenCalledTimes(1);
});

test("closes before the server starts", async () => {
  const server = makeServer();
  const lifecycle = createHealthServerLifecycle(server);

  await lifecycle.close();

  expect(server.close).not.toHaveBeenCalled();
});

test("rejects start and close failures", async () => {
  const startServer = makeServer();
  startServer.listen.mockImplementation(() => startServer.fail(new Error("listen failed")));
  const startLifecycle = createHealthServerLifecycle(startServer);
  await expect(startLifecycle.start()).rejects.toThrow("listen failed");
  expect(startServer.off).toHaveBeenCalledWith("error", expect.any(Function));

  const throwingServer = makeServer();
  throwingServer.listen.mockImplementation(() => {
    throw new Error("listen threw");
  });
  const throwingLifecycle = createHealthServerLifecycle(throwingServer);
  await expect(throwingLifecycle.start()).rejects.toThrow("listen threw");
  expect(throwingServer.off).toHaveBeenCalledWith("error", expect.any(Function));

  const closeServer = makeServer();
  closeServer.listening = true;
  closeServer.close.mockImplementation((callback) => callback(new Error("close failed")));
  const closeLifecycle = createHealthServerLifecycle(closeServer);
  await expect(closeLifecycle.close()).rejects.toThrow("close failed");
});
