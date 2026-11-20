export default function createPresence(version) {
  return {
    activities: [{ name: `ask v${version}`, type: 4 }],
    status: "online",
  };
}
