import * as classValidatorLib from "class-validator";
import ClassValidatorFields from "../class-validator-fields";

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string;
}> {}

describe("ClassValidatorFields Unit tests", () => {
  it("should initialize errors and variabledata with null", () => {
    const validator = new StubClassValidatorFields();
    expect(validator.errors).toBe(null);
    expect(validator.validateData).toBe(null);
  });
  it("should validate with errors", () => {
    const spyValidateSync = jest.spyOn(classValidatorLib, "validateSync");
    spyValidateSync.mockReturnValue([
      {
        property: "field",
        constraints: { isRequired: "some error" },
      },
    ]);
    const validator = new StubClassValidatorFields();
    expect(validator.validate(null)).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.validateData).toBe(null);
    expect(validator.errors).toStrictEqual({ field: ["some error"] });
  });

  it("should validate without errors", () => {
    const spyValidateSync = jest.spyOn(classValidatorLib, "validateSync");
    spyValidateSync.mockReturnValue([]);
    const validator = new StubClassValidatorFields();
    expect(validator.validate({ field: "val" })).toBeTruthy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.errors).toBeNull();
    expect(validator.validateData).toStrictEqual({ field: "val" });
  });
});
