import { ValidationError } from "../../errors/validation-error";
import ValidatorRules from "../validator-rules";

interface IExpectedAssertRule {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error?: Error;
  params?: any[];
}

function assertIsInvalid(expected: IExpectedAssertRule) {
  expect(() => {
    runRule(expected);
  }).toThrow(expected.error);
}

function assertIsValid(expected: IExpectedAssertRule) {
  expect(() => {
    runRule(expected);
  }).not.toThrow();
}

function runRule({
  value,
  property,
  rule,
  params,
}: Omit<IExpectedAssertRule, "error">) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule] as any;
  method.apply(validator, params);
}
describe("ValidatorRules Unit Tests", () => {
  test("value methods", () => {
    const validator = ValidatorRules.values("some value", "field");
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toBe("some value");
    expect(validator["property"]).toBe("field");
  });

  test("required validation rule", () => {
    // Invalid
    let arrange = [
      { value: null, property: "field", errorMsg: "The field is required" },
      {
        value: undefined,
        property: "field",
        errorMsg: "The field is required",
      },
      { value: "", property: "field", errorMsg: "The field is required" },
    ];
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "required",
        error: new ValidationError(item.errorMsg),
      });
    });

    // Valid

    arrange = [
      { value: "test", property: "field" },
      {
        value: 5,
        property: "field",
      },
      { value: false, property: "field" },
      { value: 0, property: "field" },
    ] as any;

    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "required",
      });
    });
  });

  test("string rule", () => {
    // Invalid
    let arrange = [
      { value: 5, property: "field" },
      { value: {}, property: "field" },
      { value: false, property: "field" },
    ];
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "string",
        error: new ValidationError("The field must be a string"),
      });
    });

    // Valid

    arrange = [
      { value: null, property: "field" },
      { value: undefined, property: "field" },
      { value: "teste", property: "field" },
    ] as any;

    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "string",
      });
    });
  });

  test("max length rule", () => {
    // Invalid
    let arrange = [{ value: "aaaaaa", property: "field" }];
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error: new ValidationError(
          "The field must be less or equal than 5 characters"
        ),
        params: [5],
      });
    });

    // Valid

    arrange = [
      { value: "teste", property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ] as any;

    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        params: [5],
      });
    });
  });

  test("boolean rule", () => {
    // Invalid
    let arrange = [
      { value: 5, property: "field" },
      { value: "true", property: "field" },
    ];
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error: new ValidationError("The field must be a boolean"),
      });
    });

    // Valid

    arrange = [
      { value: true, property: "field" },
      { value: false, property: "field" },
    ] as any;

    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "boolean",
      });
    });
  });

  it("should combine two or more invalid rules and throw", () => {
    expect(() => {
      const validator = ValidatorRules.values(5, "field");
      validator.required().boolean();
    }).toThrowError(new ValidationError("The field must be a boolean"));

    expect(() => {
      const validator = ValidatorRules.values(true, "field");
      validator.required().string();
    }).toThrowError(new ValidationError("The field must be a string"));

    expect(() => {
      const validator = ValidatorRules.values("aaaaaaa", "field");
      validator.required().string().maxLength(5);
    }).toThrowError(
      new ValidationError("The field must be less or equal than 5 characters")
    );
  });

  it("should combine two or more valid rules", () => {
    expect(() => {
      const validator = ValidatorRules.values("aaaa", "field");
      validator.required().string();
    }).not.toThrow();

    expect(() => {
      const validator = ValidatorRules.values(true, "field");
      validator.required().boolean();
    }).not.toThrow();

    expect(() => {
      const validator = ValidatorRules.values(true, "field");
      validator.required().boolean();
    }).not.toThrow();
  });
});
