import splitBlockquoted from "../formatting/chunks.mjs";
import defaultSplit from "../splitting.mjs";

export default function createSlashChunks(text, urls) {
  return [
    ...(text ? splitBlockquoted(text, 2000) : []),
    ...urls.flatMap((url) => defaultSplit(url, 2000)),
  ];
}
