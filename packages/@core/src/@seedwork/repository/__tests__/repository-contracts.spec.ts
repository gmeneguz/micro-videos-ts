import { SearchParams, SearchResult } from "../repository-contracts";

describe("SearchParams Unit Tests", () => {
  test("page prop", () => {
    const arrange = [
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: "", expected: 1 },
      { page: "fake", expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 5.5, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },
      { page: 1, expected: 1 },
      { page: 2, expected: 2 },
    ];
    arrange.forEach((item) => {
      expect(new SearchParams({ page: item.page as any }).page).toBe(
        item.expected
      );
    });
  });

  test("limit prop", () => {
    const arrange = [
      { value: null, expected: 15 },
      { value: undefined, expected: 15 },
      { value: "", expected: 15 },
      { value: "fake", expected: 15 },
      { value: 0, expected: 15 },
      { value: -1, expected: 15 },
      { value: 5.5, expected: 15 },
      { value: true, expected: 1 },
      { value: false, expected: 15 },
      { value: {}, expected: 15 },

      { value: 1, expected: 1 },
      { value: 2, expected: 2 },
      { value: 10, expected: 10 },
    ];
    arrange.forEach((item) => {
      expect(new SearchParams({ limit: item.value as any }).limit).toBe(
        item.expected
      );
    });
  });

  test("sortBy prop", () => {
    const params = new SearchParams();
    expect(params.sortBy).toBe(null);
    const arrange = [
      { value: null, expected: null },
      { value: undefined, expected: null },
      { value: "", expected: null },
      { value: "test", expected: "test" },
      { value: "0", expected: "0" },
      { value: -1, expected: "-1" },
      { value: 5.5, expected: "5.5" },
      { value: true, expected: "true" },
      { value: "false", expected: "false" },
      { value: {}, expected: "[object Object]" },
    ];
    arrange.forEach((item) => {
      expect(new SearchParams({ sortBy: item.value as any }).sortBy).toBe(
        item.expected
      );
    });
  });

  test("sortDir prop", () => {
    let params = new SearchParams();
    expect(params.sortDir).toBe(null);

    params = new SearchParams({ sortDir: null });
    expect(params.sortDir).toBe(null);

    params = new SearchParams({ sortDir: "" as any });
    expect(params.sortDir).toBe(null);

    const arrange = [
      { value: null, expected: "asc" },
      { value: undefined, expected: "asc" },
      { value: "", expected: "asc" },
      { value: "test", expected: "asc" },
      { value: "0", expected: "asc" },
      { value: -1, expected: "asc" },
      { value: 5.5, expected: "asc" },
      { value: true, expected: "asc" },
      { value: "false", expected: "asc" },
      { value: "ASC", expected: "asc" },
      { value: "DESC", expected: "desc" },
      { value: "desc", expected: "desc" },
      { value: "dEsC", expected: "desc" },
    ];
    arrange.forEach((item) => {
      expect(
        new SearchParams({ sortBy: "field", sortDir: item.value as any })
          .sortDir
      ).toBe(item.expected);
    });
  });

  test("filter prop", () => {
    let params = new SearchParams();
    expect(params.filter).toBe(null);

    const arrange = [
      { value: null, expected: null },
      { value: undefined, expected: null },
      { value: "", expected: null },
      { value: "fake", expected: "fake" },
      { value: "0", expected: "0" },
      { value: -1, expected: "-1" },
      { value: 5.5, expected: "5.5" },
      { value: true, expected: "true" },
      { value: "false", expected: "false" },
      { value: {}, expected: "[object Object]" },
    ];
    arrange.forEach((item) => {
      expect(new SearchParams({ filter: item.value as any }).filter).toBe(
        item.expected
      );
    });
  });
});

describe("SearchResult Unit Tests", () => {
  test("constructor props", () => {
    const obj: any = {
      items: ["a", "b"] as any,
      total: 4,
      sort: null,
      sortDir: null,
      currentPage: 1,
      perPage: 2,
      filter: null,
    };
    let res = new SearchResult(obj);
    expect(res.toJSON()).toStrictEqual({ ...obj, lastPage: 2 });
  });

  test("last page = 1 when perPage greater than total", () => {
    const obj: any = {
      items: ["a", "b"] as any,
      total: 4,
      sort: null,
      sortDir: null,
      currentPage: 1,
      perPage: 15,
      filter: null,
    };
    let res = new SearchResult(obj);
    expect(res.toJSON()).toStrictEqual({ ...obj, lastPage: 1 });
  });

  test("lastPage when total not divisible by perPage", () => {
    const obj: any = {
      items: ["a", "b"] as any,
      total: 101,
      sort: null,
      sortDir: null,
      currentPage: 1,
      perPage: 20,
      filter: null,
    };
    let res = new SearchResult(obj);
    expect(res.lastPage).toBe(6);
  });
});
