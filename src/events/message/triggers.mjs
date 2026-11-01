const namePattern = /^\s*ask(?:\b\s*[,!:]?\s*|$)/i;

export function isAddressedByName(content) {
  return namePattern.test(content || "");
}

export function isMessageTriggered({ isDirect, isMentioned, isReplyToBot, addressedByName }) {
  return isDirect || isMentioned || isReplyToBot || addressedByName;
}
