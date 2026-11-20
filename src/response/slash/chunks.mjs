import __formattingModule from "../formatting.mjs";
const { defaultSplit, splitBlockquoted } = __formattingModule;

export default function createSlashChunks(text, urls) {
  return [
    ...(text ? splitBlockquoted(text, 2000) : []),
    ...urls.flatMap((url) => defaultSplit(url, 2000)),
  ];
}
