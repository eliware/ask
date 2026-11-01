export function createShutdownManager({ log, healthServer }) {
  let client;
  let shuttingDown = false;

  async function shutdownClient(target = client) {
    try {
      if (target) await target.shutdown();
    } catch (error) {
      log.warn("Discord shutdown failed", { error: error?.message || String(error) });
    }
  }

  async function shutdownHealthServer() {
    try {
      healthServer?.setReady(false);
      await healthServer?.close();
    } catch (error) {
      log.warn("Health server shutdown failed", { error: error?.message || String(error) });
    }
  }

  return {
    setClient(value) {
      client = value;
    },
    isShuttingDown: () => shuttingDown,
    shutdownClient,
    shutdownHealthServer,
    shutdownHook: async () => {
      if (shuttingDown) return;
      shuttingDown = true;
      await shutdownClient();
      await shutdownHealthServer();
    },
  };
}
