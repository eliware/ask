import generatedImageFilename from "../../../../src/response/images/image-generation/filename.mjs";

test("uses the generated image ID in its filename", () => {
  expect(generatedImageFilename("image-id")).toBe("image_image-id.png");
});

test("replaces path separators and filename-special characters", () => {
  expect(generatedImageFilename("../folder/image:id")).toBe("image_folder_image_id.png");
});

test("uses a timestamp when the ID has no safe filename characters", () => {
  expect(generatedImageFilename("../")).toMatch(/^image_\d+\.png$/u);
});

test("uses a timestamp when the generated image has no ID", () => {
  expect(generatedImageFilename()).toMatch(/^image_\d+\.png$/u);
});
