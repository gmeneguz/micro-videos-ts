import Entity from "../../domain/entity/entity";
import { InMemorySearchableRepository } from "../in-memory-repository";
import { SearchParams, SearchResult } from "../repository-contracts";

type StubEntityProps = {
  name: string;
  price: number;
};
class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields = ["name"];
  protected applyFilter(
    items: StubEntity[],
    filter: string
  ): Promise<StubEntity[]> {
    if (!filter) return Promise.resolve(items);

    return Promise.resolve(
      items.filter(
        (i) =>
          i.props.name.toLowerCase().includes(filter.toLowerCase()) ||
          i.props.price.toString() === filter
      )
    );
  }
}

describe("InMemorySearchableRepository Unit Tests", () => {
  let repo: StubInMemorySearchableRepository;
  beforeEach(() => {
    repo = new StubInMemorySearchableRepository();
  });

  describe("applyFilter method", () => {
    it("should not filter items when there is no filter", async () => {
      const items = [
        new StubEntity({ name: "bbb", price: 4 }),
        new StubEntity({ name: "abc", price: 5 }),
        new StubEntity({ name: "ccc", price: 6 }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);
      const filtered = await repo["applyFilter"](items, null);
      expect(filtered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter items with filter param", async () => {
      const items = [
        new StubEntity({ name: "another", price: 5 }),
        new StubEntity({ name: "test", price: 5 }),
        new StubEntity({ name: "TEST", price: 4 }),
      ];

      const spyFilterMethod = jest.spyOn(items, "filter" as any);
      let filtered = await repo["applyFilter"](items, "test");
      expect(filtered).toStrictEqual([items[1], items[2]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      filtered = await repo["applyFilter"](items, "5");
      expect(filtered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      filtered = await repo["applyFilter"](items, "nonee");
      expect(filtered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });
  describe("applySort method", () => {
    it("should not sort items", async () => {
      const items = [
        new StubEntity({ name: "another", price: 5 }),
        new StubEntity({ name: "ddd", price: 5 }),
        new StubEntity({ name: "ccc", price: 4 }),
      ];

      let sorted = await repo["applySort"](items);
      expect(sorted).toStrictEqual(items);

      sorted = await repo["applySort"](items, "price");
      expect(sorted).toStrictEqual(items);
    });

    it("should sort items", async () => {
      const items = [
        new StubEntity({ name: "b", price: 6 }),
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "c", price: 4 }),
      ];

      // ASC
      let sorted = await repo["applySort"](items, "name");
      expect(sorted).toStrictEqual([items[1], items[0], items[2]]);

      sorted = await repo["applySort"](items, "name", "asc");
      expect(sorted).toStrictEqual([items[1], items[0], items[2]]);

      //DESC
      sorted = await repo["applySort"](items, "name", "desc");
      expect(sorted).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe("applyPaginate method", () => {
    it("should paginate items", async () => {
      const items = [
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "c", price: 4 }),
        new StubEntity({ name: "d", price: 4 }),
        new StubEntity({ name: "e", price: 4 }),
        new StubEntity({ name: "f", price: 4 }),
      ];

      let paginated = await repo["applyPaginate"](items, 1, 2);
      expect(paginated).toStrictEqual([items[0], items[1]]);

      paginated = await repo["applyPaginate"](items, 2, 2);
      expect(paginated).toStrictEqual([items[2], items[3]]);

      paginated = await repo["applyPaginate"](items, 1, 30);
      expect(paginated).toStrictEqual(items);
    });
  });

  describe("search method", () => {
    it('should apply only paginate when no other params', async () => {
      const item = new StubEntity({ name: 'aa', price: 10 });
      const items = Array(16).fill(item);
      repo.items = items;
      const result = await repo.search(new SearchParams({}));

      expect(result).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(item),
          total: 16,
          perPage: 15,
          sort: null,
          sortDir: null,
          filter: null,
          currentPage: 1,
        }),
      );
    });

    it('should apply paginate and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'teSt', price: 5 }),
        new StubEntity({ name: 'eee', price: 4 }),
        new StubEntity({ name: 'aatest', price: 4 }),
        new StubEntity({ name: 'TEST', price: 4 }),
      ];

      repo.items = items;
      let result = await repo.search(
        new SearchParams({
          page: 1,
          limit: 2,
          filter: 'test',
        }),
      );

      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[0], items[1]],
          total: 4,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'test',
          currentPage: 1,
        }),
      );

      result = await repo.search(
        new SearchParams({
          page: 2,
          limit: 2,
          filter: 'test',
        }),
      );

      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[3], items[4]],
          total: 4,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'test',
          currentPage: 2,
        }),
      );
    });

    it('should apply paginate and sort', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'c', price: 5 }),
        new StubEntity({ name: 'd', price: 4 }),
        new StubEntity({ name: 'a', price: 4 }),
        new StubEntity({ name: 'e', price: 4 }),
      ];

      repo.items = items;

      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            limit: 2,
            sortBy: 'name',
          }),
          result: new SearchResult({
            items: [items[3], items[0]],
            total: 5,
            perPage: 2,
            sort: 'name',
            sortDir: 'asc',
            filter: null,
            currentPage: 1,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            limit: 2,
            sortBy: 'name',
          }),
          result: new SearchResult({
            items: [items[1], items[2]],
            total: 5,
            perPage: 2,
            sort: 'name',
            sortDir: 'asc',
            filter: null,
            currentPage: 2,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            limit: 2,
            sortBy: 'name',
            sortDir: 'desc',
          }),
          result: new SearchResult({
            items: [items[1], items[0]],
            total: 5,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc',
            filter: null,
            currentPage: 2,
          }),
        },
      ];

      for (let testItem of arrange) {
        let result = await repo.search(testItem.params);
        expect(result).toStrictEqual(testItem.result);
      }
    });

    // test.each(arrange)('when value is %j', async ({ params, result }) => {
    //   const res = await repo.search(params);
    //   expect(res).toStrictEqual(result);
    // });
    
    it('should search, sort, filter and paginate', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'c', price: 5 }),
        new StubEntity({ name: 'd', price: 4 }),
        new StubEntity({ name: 'a', price: 4 }),
        new StubEntity({ name: 'e', price: 4 }),
        new StubEntity({ name: 'f', price: 4 }),
        new StubEntity({ name: 'g', price: 4 }),
      ];
      repo.items = items;
      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            limit: 2,
            sortBy: 'name',
            filter: '4',
          }),
          result: new SearchResult({
            items: [items[3], items[2]],
            total: 5,
            perPage: 2,
            sort: 'name',
            sortDir: 'asc',
            filter: '4',
            currentPage: 1,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            limit: 2,
            sortBy: 'name',
            filter: '4',
          }),
          result: new SearchResult({
            items: [items[4], items[5]],
            total: 5,
            perPage: 2,
            sort: 'name',
            sortDir: 'asc',
            filter: '4',
            currentPage: 2,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            limit: 2,
            sortBy: 'name',
            filter: '4',
            sortDir: 'desc',
          }),
          result: new SearchResult({
            items: [items[4], items[2]],
            total: 5,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc',
            filter: '4',
            currentPage: 2,
          }),
        },
      ];

      for (let testItem of arrange) {
        let result = await repo.search(testItem.params);
        expect(result).toStrictEqual(testItem.result);
      }
    });
  });
});
