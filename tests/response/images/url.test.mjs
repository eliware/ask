import { extractImageUrl } from "../../../src/response/images/url.mjs";

test("extracts image URLs from supported fields", () => {
  const cases = [
    { image: { url: "https://one.test" } },
    { url: "https://two.test" },
    { src: "https://three.test" },
    { href: "https://four.test", filename: "four.png", description: "four" },
  ];
  for (const value of cases) {
    expect(extractImageUrl(value).image).toMatchObject({ url: expect.any(String) });
  }
  expect(extractImageUrl({})).toEqual({ handled: false, image: null });
  expect(extractImageUrl(null)).toEqual({ handled: false, image: null });
  expect(extractImageUrl({ image: { url: "" } })).toEqual({ handled: false, image: null });
});
