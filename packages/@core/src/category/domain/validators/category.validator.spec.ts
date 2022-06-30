import CategoryValidatorFactory, {
  CategoryValidator,
  CategoryRules,
} from "./category.validator";
describe("CategoryValidator Tests", () => {
  let validator = new CategoryValidator();

  beforeEach(() => {
    validator = CategoryValidatorFactory.create();
  });
  test("invalid cases for name field", () => {
    const arrange = [
      {
        data: null,
        errors: {
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        data: { name: "" },
        errors: {
          name: ["name should not be empty"],
        },
      },
      {
        data: { name: 5 as any },
        errors: {
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        data: { name: "d".repeat(256) },
        errors: {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      },
    ];

    arrange.forEach((item) => {
      expect({ validator, data: item.data }).containsErrorMessages(item.errors);
    });
  });

  test("valid cases for fields", () => {
    const arrange = [
      { name: "ok", description: "aa" },
      { name: "ok", description: undefined },
      { name: "ok", description: null },
      { name: "ok", is_active: true },
      { name: "ok", is_active: false },
    ];

    arrange.forEach((item) => {
      const isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validateData).toStrictEqual(new CategoryRules(item));
    });
  });
});
