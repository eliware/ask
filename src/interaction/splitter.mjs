import __formattingModule from "../response/formatting.mjs";

const { defaultSplit } = __formattingModule;

export default async function selectMessageSplitter() {
  try {
    const module = await import("@eliware/discord");
    if (typeof module.splitMsg === "function") return module.splitMsg;
  } catch {}
  return defaultSplit;
}
