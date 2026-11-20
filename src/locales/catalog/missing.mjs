export default function findMissingLocales(names, supportedLocales) {
  return supportedLocales
    .filter((locale) => !names.includes(locale))
    .map((locale) => "missing " + locale);
}
