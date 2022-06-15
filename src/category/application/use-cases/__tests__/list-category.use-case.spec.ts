import ListCategoryUseCase from "../list-category.use-case.ts";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import Category from "../../../domain/entities/category";
import { CategoryRepository } from "../../../domain/repository/category.repository";
describe("ListCategoryUseCase Tests", () => {
  let useCase: ListCategoryUseCase;
  let repo: CategoryInMemoryRepository;

  beforeEach(() => {
    repo = new CategoryInMemoryRepository();
    useCase = new ListCategoryUseCase(repo);
  });

  test("output method", () => {
    let res = new CategoryRepository.SearchResult({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    });
    let out = useCase["toOutput"](res);
    expect(out).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    });

    const entity = new Category({ name: "movie" });

    res = new CategoryRepository.SearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    });
    out = useCase["toOutput"](res);
    expect(out).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    });
  });

  it("should return list with empty input", async () => {
    const created_at = new Date();
    const created_at2 = new Date(created_at.getTime() - 100);
    const items = [
      new Category({ name: "movie", created_at }),
      new Category({ name: "movie2", created_at: created_at2 }),
    ];
    repo.items = items;

    const out = await useCase.execute({});
    expect(out).toStrictEqual({
      items: [...items].reverse().map((e) => e.toJSON()),
      total: 2,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    });
  });

  it("should apply filter and sort", async () => {
    const items = [
      new Category({ name: "aaa" }),
      new Category({ name: "ddd" }),
      new Category({ name: "ccc" }),
      new Category({ name: "azz" }),
    ];
    repo.items = items;

    let out = await useCase.execute({
      page: 1,
      limit: 2,
      filter: "a",
      sortBy: "name",
      sortDir: "asc",
    });
    expect(out).toStrictEqual({
      items: [items[0].toJSON(), items[3].toJSON()],
      total: 2,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    });

    out = await useCase.execute({
      page: 1,
      limit: 2,
      filter: null,
      sortBy: "name",
      sortDir: "desc",
    });
    expect(out).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 4,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });
  });
});
