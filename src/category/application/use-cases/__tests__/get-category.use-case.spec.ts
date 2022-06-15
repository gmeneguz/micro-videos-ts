import GetCategoryUseCase from "../get-category.use-case";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import NotFoundError from "../../../../@seedwork/errors/not-found-error";
import Category from "../../../domain/entities/category";
describe("GetCategoryUseCase Tests", () => {
  let useCase: GetCategoryUseCase;
  let repo: CategoryInMemoryRepository;

  beforeEach(() => {
    repo = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(repo);
  });

  it("should throw error when entity not found", async () => {
    expect(() => useCase.execute({ id: "fake Id" })).rejects.toThrow(
      new NotFoundError("Entity Not Found with id fake Id")
    );
  });

  it("should return a category", async () => {
    const items = [new Category({ name: "movie" })];
    repo.items = items;
    const out = await useCase.execute({ id: items[0].id });
    const { id, name, description, is_active, created_at } = items[0];
    expect(out).toStrictEqual({ id, name, description, is_active, created_at });
  });
});
