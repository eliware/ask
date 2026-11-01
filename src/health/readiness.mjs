export function createReadinessState() {
  let ready = false;
  return {
    isReady: () => ready,
    setReady(value) {
      ready = Boolean(value);
    },
  };
}
