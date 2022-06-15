import {
  SearchResult,
  SortDirection,
} from "../../repository/repository-contracts";
import { PaginationOutputMapper } from "./pagination-output";
describe("PaginationOutputMapper Unit Test", () => {
  it("should convert a SearchResult to output", () => {
    const baseResult = {
      items: [] as any,
      perPage: 5,
      currentPage: 1,
      sort: "aa",
      sortDir: "desc" as SortDirection,
      total: 5,
      filter: null,
    } as any;
    const searchResult = new SearchResult(baseResult);
    const out = PaginationOutputMapper.toPaginationOutput(searchResult);

    expect(out).toStrictEqual({
      perPage: 5,
      currentPage: 1,
      total: 5,
      lastPage: 1,
    });
  });
});
