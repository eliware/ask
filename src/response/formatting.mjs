export default function addBlockquote(text) {
  return String(text ?? "")
    .split(/\r?\n/)
    .map((line) => (line.trim() === "" ? "> " : `> ${line}`))
    .join("\n");
}
