import { DeleteCategoryUseCase } from "../delete-category.use-case";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import NotFoundError from "../../../../@seedwork/errors/not-found-error";
import { Category } from "#category/domain/entities/category";

describe("DeleteCategoryUseCase Tests", () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repo: CategoryInMemoryRepository;

  beforeEach(() => {
    repo = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase.UseCase(repo);
  });

  it("should throw error when deleting an entity that not exists", async () => {
    expect(() => useCase.execute({ id: "fake Id" })).rejects.toThrow(
      new NotFoundError("Entity Not Found with id fake Id")
    );
  });

  it("should exclude a category", async () => {
    const entity1 = new Category({ name: "movie" });
    const entity2 = new Category({ name: "drama" });
    const items = [entity1, entity2];
    repo.items = items;
    await useCase.execute({ id: entity1.id });
    expect(repo.findById(entity1.id.toString())).rejects.toThrow(
      new NotFoundError("Entity Not Found with id " + entity1.id)
    );
    expect(repo.items).toStrictEqual([entity2]);
  });
});
