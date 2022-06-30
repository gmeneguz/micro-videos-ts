import { Category } from "#category/domain/entities/category";

import { CategoryRepository } from "../../domain/repository/category.repository";
import CategoryInMemoryRepository from "./category-in-memory.repository";
describe("CategoryInMemoryRespository Tests", () => {
  let repo: CategoryInMemoryRepository;
  beforeEach(() => {
    repo = new CategoryInMemoryRepository();
  });

  it("should sort by created_at by default", async () => {
    const orderedDates = [
      new Date("2022-05-01"),
      new Date("2022-05-02"),
      new Date("2022-05-03"),
      new Date("2022-05-04"),
      new Date("2022-05-05"),
    ];

    const items = [
      new Category({ name: "ddd", created_at: orderedDates[3] }),
      new Category({ name: "eee", created_at: orderedDates[4] }),
      new Category({ name: "ccc", created_at: orderedDates[0] }),
      new Category({ name: "aaa", created_at: orderedDates[1] }),
      new Category({ name: "bbb", created_at: orderedDates[2] }),
    ];
    repo.items = items;

    let sortedByDate = [items[2], items[3], items[4], items[0], items[1]];

    let result = await repo.search(new CategoryRepository.SearchParams());
    expect(result.items).toStrictEqual(sortedByDate);

    result = await repo.search(
      new CategoryRepository.SearchParams({
        sortBy: "created_at",
        sortDir: "desc",
      })
    );
    sortedByDate.reverse();
    expect(result.items).toStrictEqual(sortedByDate);
  });

  it("should sort by name", async () => {
    const orderedDates = [
      new Date("2022-05-01"),
      new Date("2022-05-02"),
      new Date("2022-05-03"),
      new Date("2022-05-04"),
      new Date("2022-05-05"),
    ];

    const items = [
      new Category({ name: "ddd", created_at: orderedDates[3] }),
      new Category({ name: "eee", created_at: orderedDates[4] }),
      new Category({ name: "ccc", created_at: orderedDates[0] }),
      new Category({ name: "aaa", created_at: orderedDates[1] }),
      new Category({ name: "bbb", created_at: orderedDates[2] }),
    ];
    repo.items = items;

    const sortedByName = [items[3], items[4], items[2], items[0], items[1]];

    let result = await repo.search(
      new CategoryRepository.SearchParams({ sortBy: "name" })
    );
    expect(result.items).toStrictEqual(sortedByName);

    result = await repo.search(
      new CategoryRepository.SearchParams({ sortBy: "name", sortDir: "desc" })
    );
    sortedByName.reverse();
    expect(result.items).toStrictEqual(sortedByName);
  });

  it("should filter by name", async () => {
    const orderedDates = [
      new Date("2022-05-01"),
      new Date("2022-05-02"),
      new Date("2022-05-03"),
      new Date("2022-05-04"),
      new Date("2022-05-05"),
    ];

    const items = [
      new Category({ name: "aaatestaaaa", created_at: orderedDates[0] }),
      new Category({ name: "bbbTesTTT", created_at: orderedDates[1] }),
      new Category({ name: "TES", created_at: orderedDates[2] }),
      new Category({ name: "anyname", created_at: orderedDates[3] }),
      new Category({ name: "abcdTESTdef", created_at: orderedDates[4] }),
    ];
    repo.items = items;

    const filteredItems = [items[0], items[1], items[4]];

    let result = await repo.search(
      new CategoryRepository.SearchParams({ filter: "TEST" })
    );
    expect(result.items).toStrictEqual(filteredItems);
  });
});
