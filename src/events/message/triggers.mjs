export function isMessageTriggered({ isDirect, isMentioned, isReplyToBot, addressedByName }) {
  return isDirect || isMentioned || isReplyToBot || addressedByName;
}
