const namePattern = /^\s*ask(?:\b\s*[,!:]?\s*|$)/i;

export function isAddressedByName(content) {
  return namePattern.test(content || "");
}

export function removeNameAddress(content) {
  return content.replace(namePattern, "");
}
