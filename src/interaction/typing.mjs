export function createTypingManager(channel) {
  let typingInterval = null;
  const stop = () => {
    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
  };
  const start = async () => {
    try {
      await channel?.sendTyping?.();
    } catch {}
    if (channel?.sendTyping && !typingInterval)
      typingInterval = setInterval(() => {
        try {
          channel.sendTyping();
        } catch {}
      }, 8000);
  };
  return { start, stop };
}
