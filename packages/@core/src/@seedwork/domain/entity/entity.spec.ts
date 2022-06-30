import { UniqueEntityId } from "../value-objects/unique-entity-id.vo";
import Entity from "./entity";

class StubEntity extends Entity<{ prop1: string; prop2: number }> {}
describe("Entity Unit tests", () => {
  it("should set props and id", () => {
    const arrange = { prop1: "aa", prop2: 3 };
    const ent = new StubEntity(arrange);
    expect(ent.props).toStrictEqual(arrange);
    expect(ent.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
  });

  it("should accept valid uuid", () => {
    const arrange = { prop1: "aa", prop2: 3 };
    const uniqueEntityId = new UniqueEntityId();
    const ent = new StubEntity(arrange, uniqueEntityId);
    expect(ent.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(ent.id).toBe(uniqueEntityId.value);
  });
  it("should convert to json", () => {
    const arrange = { prop1: "aa", prop2: 3 };
    const uniqueEntityId = new UniqueEntityId();
    const ent = new StubEntity(arrange, uniqueEntityId);
    expect(ent.toJSON()).toStrictEqual({ id: ent.id, ...arrange });
  });
});
