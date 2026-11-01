import { defaultSplit } from "../response/formatting.mjs";

export async function splitMessage(text, max) {
  try {
    const mod = await import("@eliware/discord");
    if (typeof mod.splitMsg === "function") return mod.splitMsg(text, max);
  } catch {}
  return defaultSplit(text, max);
}
