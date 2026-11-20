import defaultSplit from "../response/splitting.mjs";

export default async function selectMessageSplitter() {
  try {
    const module = await import("@eliware/discord");
    if (typeof module.splitMsg === "function") return module.splitMsg;
  } catch {}
  return defaultSplit;
}
