import selectMessageSplitter from "./splitter.mjs";

export default async function splitMessage(text, max) {
  const splitter = await selectMessageSplitter();
  return splitter(text, max);
}
