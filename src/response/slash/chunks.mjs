import __formattingModule from "../formatting.mjs";
import defaultSplit from "../splitting.mjs";
const { splitBlockquoted } = __formattingModule;

export default function createSlashChunks(text, urls) {
  return [
    ...(text ? splitBlockquoted(text, 2000) : []),
    ...urls.flatMap((url) => defaultSplit(url, 2000)),
  ];
}
