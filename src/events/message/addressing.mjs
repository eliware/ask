const namePattern = /^\s*ask(?:\b\s*[,!:]?\s*|$)/i;

function isAddressedByName(content) {
  return namePattern.test(content || "");
}

function removeNameAddress(content) {
  return content.replace(namePattern, "");
}

export default { isAddressedByName, removeNameAddress };
