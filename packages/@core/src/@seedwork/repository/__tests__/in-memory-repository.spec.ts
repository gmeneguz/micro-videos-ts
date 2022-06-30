import Entity from "../../domain/entity/entity";
import { UniqueEntityId } from "../../domain/value-objects/unique-entity-id.vo";
import NotFoundError from "../../errors/not-found-error";
import { InMemoryRepository } from "../in-memory-repository";

interface ItemProps {
  name: string;
  price: number;
}
class Item extends Entity<ItemProps> {}

class StubRepository extends InMemoryRepository<Item> {}
describe("InMemoryRepository Unit Tests", () => {
  let stubRepository: StubRepository;
  beforeEach(() => {
    stubRepository = new StubRepository();
  });

  it("should insert new entity", async () => {
    const entity = new Item({ name: "abc", price: 50 });
    await stubRepository.insert(entity);
    expect(stubRepository.items[0]).toBe(entity);
  });

  it("should throw error entity not found", async () => {
    await expect(() => stubRepository.findById("fake id")).rejects.toThrowError(
      new NotFoundError("Entity Not Found with id fake id")
    );
    const uuid = new UniqueEntityId();
    await expect(() => stubRepository.findById(uuid)).rejects.toThrowError(
      new NotFoundError(`Entity Not Found with id ${uuid}`)
    );
  });

  it("should find entity by id", async () => {
    const entity = new Item({ name: "abc", price: 50 });
    await stubRepository.insert(entity);
    const result = await stubRepository.findById(entity.id);
    const result2 = await stubRepository.findById(entity.uniqueEntityId);
    expect(result).toBe(entity);
    expect(result2).toBe(entity);
  });

  test("update entity method", async () => {
    const entity = new Item({ name: "abc", price: 50 });

    await expect(() => stubRepository.update(entity)).rejects.toThrowError(
      new NotFoundError(`Entity Not Found with id ${entity.id}`)
    );

    await stubRepository.insert(entity);
    const updatedEntity = new Item(
      {
        name: "cdef",
        price: 60,
      },
      entity.uniqueEntityId
    );
    await stubRepository.update(updatedEntity);
    expect(stubRepository.items[0]).not.toBe(entity);
    expect(stubRepository.items[0]).toBe(updatedEntity);
  });

  test("delete entity method", async () => {
    const entity = new Item({ name: "abc", price: 50 });

    await expect(() => stubRepository.delete(entity.id)).rejects.toThrowError(
      new NotFoundError(`Entity Not Found with id ${entity.id}`)
    );

    await stubRepository.insert(entity);

    await stubRepository.delete(entity.id);
    expect(stubRepository.items).toHaveLength(0);
  });
});
