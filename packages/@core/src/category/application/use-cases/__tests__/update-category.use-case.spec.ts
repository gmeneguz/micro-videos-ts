import { UpdateCategoryUseCase } from "../update-category.use-case";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import NotFoundError from "../../../../@seedwork/errors/not-found-error";
import { Category } from "#category/domain/entities/category";

describe("UpdateCategoryUseCase UnitTests", () => {
  let useCase: UpdateCategoryUseCase.UseCase;
  let repo: CategoryInMemoryRepository;

  beforeEach(() => {
    repo = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase.UseCase(repo);
  });

  it("should throw error when entity not found", async () => {
    expect(() =>
      useCase.execute({ id: "fake Id", name: "fake" })
    ).rejects.toThrow(new NotFoundError("Entity Not Found with id fake Id"));
  });

  it("should update a category", async () => {
    const spyOn = jest.spyOn(repo, "update");
    const entity = new Category({ name: "test" });
    repo.items = [entity];

    let out = await useCase.execute({
      id: entity.id,
      name: "test2",
      description: "desc!",
    });
    let expected = {
      id: repo.items[0].id,
      name: "test2",
      description: "desc!",
      is_active: true,
      created_at: repo.items[0].created_at,
    } as Category;
    expect(out).toStrictEqual(expected);
    expect(repo.items[0].toJSON()).toStrictEqual(expected);
    expect(spyOn).toHaveBeenCalledTimes(1);

    out = await useCase.execute({
      id: entity.id,
      name: "test3",
      description: null,
      is_active: false,
    });
    expected = {
      id: repo.items[0].id,
      name: "test3",
      description: null,
      is_active: false,
      created_at: repo.items[0].created_at,
    } as Category;

    expect(out).toStrictEqual(expected);
    expect(repo.items[0].toJSON()).toStrictEqual(expected);
    expect(spyOn).toHaveBeenCalledTimes(2);
  });
});
