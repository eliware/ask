export function decodeBase64Image(value) {
  try {
    if (
      typeof value !== "string" ||
      !value ||
      value.length % 4 !== 0 ||
      !/^[A-Za-z0-9+/]*={0,2}$/.test(value)
    )
      return null;
    const decoded = Buffer.from(value, "base64");
    return decoded.toString("base64") === value ? decoded : null;
  } catch {
    return null;
  }
}
