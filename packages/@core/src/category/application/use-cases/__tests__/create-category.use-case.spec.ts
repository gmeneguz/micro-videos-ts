import { CreateCategoryUseCase } from "../create-category.use-case";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
describe("CreateCategoryUseCase Tests", () => {
  let useCase: CreateCategoryUseCase.UseCase;
  let repo: CategoryInMemoryRepository;

  beforeEach(() => {
    repo = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase.UseCase(repo);
  });

  it("should create a category", async () => {
    const spyOn = jest.spyOn(repo, "insert");
    let out = await useCase.execute({ name: "test" });
    expect(out).toStrictEqual({
      id: repo.items[0].id,
      name: "test",
      description: null,
      is_active: true,
      created_at: repo.items[0].created_at,
    });
    expect(spyOn).toHaveBeenCalledTimes(1);
    out = await useCase.execute({
      name: "test2",
      description: "desc",
      is_active: false,
    });
    expect(out).toStrictEqual({
      id: repo.items[1].id,
      name: "test2",
      description: "desc",
      is_active: false,
      created_at: repo.items[1].created_at,
    });
    expect(spyOn).toHaveBeenCalledTimes(2);
  });
});
