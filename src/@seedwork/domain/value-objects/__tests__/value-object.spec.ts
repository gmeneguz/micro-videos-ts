import ValueObject from "../value-object";

class StubValueObject extends ValueObject {}
describe("Value object Unit test", () => {
  it("sould set value", () => {
    let vo = new StubValueObject("string value");
    expect(vo.value).toBe("string value");

    vo = new StubValueObject({ props: "a" });
    expect(vo.value).toStrictEqual({ props: "a" });
  });

  it("should convert to string", () => {
    const date = new Date();
    let arrange = [
      { value: null, test: "null" },
      { value: undefined, test: "undefined" },
      { value: "", test: "" },
      { value: "fake", test: "fake" },
      { value: 0, test: "0" },
      { value: 1, test: "1" },
      { value: true, test: "true" },
      { value: false, test: "false" },
      { value: date, test: date.toString() },
      { value: { props: "val" }, test: '{"props":"val"}' },
    ];

    arrange.forEach((item) => {
      const vo = new StubValueObject(item.value);
      expect(vo + "").toBe(item.test);
    });

    // it("should be immutable", () => {
    //   const vp = new StubValueObject({ prop1: "v", nested: { a: new Date() } });

    // });
  });
});
