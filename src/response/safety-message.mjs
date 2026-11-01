export function safetyMessage(violations = []) {
  return violations.length
    ? `I can't help with that request because it appears to violate content policy (${violations.join(", ")}). Please try a different request or rephrase.`
    : `I can't help with that request because it appears to violate content policy. Please try a different request or rephrase.`;
}
