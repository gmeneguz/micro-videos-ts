import { deepFreeze } from "./object";
describe("object unit tests", () => {
  it("should not freeze scalar value", () => {
    const str = deepFreeze("a");
    expect(typeof str).toBe("string");

    const boolean = deepFreeze(true);
    expect(typeof boolean).toBe("boolean");

    const num = deepFreeze(1);
    expect(typeof num).toBe("number");
  });

  it("should be imutable object", () => {
    const obj = deepFreeze({
      prop1: "a",
      nested: { prop2: "b", prop3: new Date() },
    });
    expect(() => {
      obj.prop1 = "aaa";
    }).toThrowError();

    expect(() => {
      obj.nested.prop2 = "aaa";
    }).toThrowError();

    expect(() => {
      obj.nested.prop3 = new Date();
    }).toThrowError();

    expect(obj.nested.prop3).toBeInstanceOf(Date);
  });
});
