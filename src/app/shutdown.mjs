export function createShutdownManager({ log, healthServer }) {
  let client;
  let shuttingDown = false;
  let activeHealthServer = healthServer;

  async function shutdownClient(target = client) {
    try {
      if (target) await target.shutdown();
    } catch (error) {
      log.warn("Discord shutdown failed", { error: error?.message || String(error) });
    }
  }

  async function shutdownHealthServer() {
    try {
      activeHealthServer?.setReady(false);
      await activeHealthServer?.close();
    } catch (error) {
      log.warn("Health server shutdown failed", { error: error?.message || String(error) });
    }
  }

  return {
    setClient(value) {
      client = value;
    },
    setHealthServer(value) {
      activeHealthServer = value;
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
