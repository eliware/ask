export function addBlockquote(text) {
  return String(text ?? "")
    .split(/\r?\n/)
    .map((line) => (line.trim() === "" ? "> " : `> ${line}`))
    .join("\n");
}
export function splitBlockquoted(text, max) {
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

export function defaultSplit(text, max) {
  const out = [];
  for (let i = 0; i < text.length; i += max) out.push(text.slice(i, i + max));
  return out;
}
export function safetyMessage(violations = []) {
  return violations.length
    ? `I can't help with that request because it appears to violate content policy (${violations.join(", ")}). Please try a different request or rephrase.`
    : `I can't help with that request because it appears to violate content policy. Please try a different request or rephrase.`;
}
