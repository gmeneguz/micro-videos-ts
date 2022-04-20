import { validate } from "uuid";
import InvalidUuidError from "../../../errors/invalid-uuid.error";
import { UniqueEntityId } from "../unique-entity-id.vo";

describe("Unique entity Id tests", () => {
  it("should throw error when uuid is invalid", () => {
    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");

    expect(() => new UniqueEntityId("fake id")).toThrowError(InvalidUuidError);

    expect(validateSpy).toHaveBeenCalled();
  });

  it("should accept uuid passed", () => {
    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");
    const uniqueId = new UniqueEntityId("8ee17fd3-447c-437c-9da6-61dabb0446ba");
    expect(uniqueId).toBeInstanceOf(UniqueEntityId);
    expect(uniqueId.value).toBe("8ee17fd3-447c-437c-9da6-61dabb0446ba");
    expect(validateSpy).toHaveBeenCalled();
  });

  it("should accept no params", () => {
    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");
    const uniqueId = new UniqueEntityId();
    expect(uniqueId).toBeInstanceOf(UniqueEntityId);
    expect(validate(uniqueId.value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });
});
