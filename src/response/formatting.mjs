function addBlockquote(text) {
  return String(text ?? "")
    .split(/\r?\n/)
    .map((line) => (line.trim() === "" ? "> " : `> ${line}`))
    .join("\n");
}
function splitBlockquoted(text, max) {
  const quotedLines = [];
  for (const line of String(text ?? "").split(/\r?\n/u)) {
    if (!line.length) {
      quotedLines.push("> ");
      continue;
    }
    for (let offset = 0; offset < line.length; offset += max - 2)
      quotedLines.push(`> ${line.slice(offset, offset + max - 2)}`);
  }

  const chunks = [];
  let current = "";
  for (const line of quotedLines) {
    if (!current) current = line;
    else if (current.length + 1 + line.length <= max) current += `\n${line}`;
    else {
      chunks.push(current);
      current = line;
    }
  }
  chunks.push(current);
  return chunks;
}

export default { addBlockquote, splitBlockquoted };
