import { Category } from "./category";
describe("Category integration test", () => {
  it("should throw error on invalid create Category", () => {
    expect(() => new Category({ name: null })).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect(() => new Category({ name: "" })).containsErrorMessages({
      name: ["name should not be empty"],
    });
    expect(() => new Category({ name: "t".repeat(256) })).containsErrorMessages(
      {
        name: ["name must be shorter than or equal to 255 characters"],
      }
    );

    // Description
    expect(
      () => new Category({ name: "mm", description: 5 as any })
    ).containsErrorMessages({
      description: ["description must be a string"],
    });
    // is_active
    expect(
      () => new Category({ name: "mm", is_active: "aa" as any })
    ).containsErrorMessages({
      is_active: ["is_active must be a boolean value"],
    });
  });

  it("should throw error on invalid update Category", () => {
    expect(() =>
      new Category({ name: "aaa" }).update({ name: null, description: null })
    ).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });
    expect(() =>
      new Category({ name: "aaa" }).update({
        name: "22",
        description: 5 as any,
      })
    ).containsErrorMessages({
      description: ["description must be a string"],
    });
  });

  it("should create a valid Category", () => {
    expect.assertions(0);
    new Category({ name: "aaa" }); // NOSONAR
    new Category({ name: "aaa", description: "ok" }); // NOSONAR
    new Category({ name: "aaa", description: null }); // NOSONAR
    new Category({ name: "aaa", description: null, is_active: true }); // NOSONAR
    new Category({ name: "aaa", description: null, is_active: false }); // NOSONAR
  });
});
