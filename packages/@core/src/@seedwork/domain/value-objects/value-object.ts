import { deepFreeze } from "../utils/object";

export abstract class ValueObject<T = any> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = deepFreeze(value);
  }

  get value(): T {
    return this._value;
  }
  toString() {
    if (typeof this.value !== "object" || this.value instanceof Date) {
      return `${this.value}`;
    } else {
      return JSON.stringify(this.value);
    }
  }
}
export default ValueObject;
