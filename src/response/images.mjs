export function decodeBase64Image(value) {
  try {
    if (
      typeof value !== "string" ||
      !value ||
      value.length % 4 !== 0 ||
      !/^[A-Za-z0-9+/]*={0,2}$/.test(value)
    )
      return null;
    return Buffer.from(value, "base64");
  } catch {
    return null;
  }
}
