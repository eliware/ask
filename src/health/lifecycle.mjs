export function createHealthServerLifecycle(server, { host = "127.0.0.1", port = 3000 } = {}) {
  return {
    start: () =>
      new Promise((resolve, reject) => {
        const onError = (error) => {
          server.off("error", onError);
          reject(error);
        };
        server.once("error", onError);
        try {
          server.listen(port, host, () => {
            server.off("error", onError);
            resolve();
          });
        } catch (error) {
          server.off("error", onError);
          reject(error);
        }
      }),
    close: () =>
      new Promise((resolve, reject) => {
        if (!server.listening) {
          resolve();
          return;
        }
        server.close((error) => (error ? reject(error) : resolve()));
      }),
    address: () => server.address(),
  };
}
