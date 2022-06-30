import { SearchResult } from "../../repository/repository-contracts";

export type PaginationOutputDto<Items> = {
  items: Items[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
};

export class PaginationOutputMapper {
  static toPaginationOutput(
    result: SearchResult<any>
  ): Omit<PaginationOutputDto<any>, "items"> {
    const { total, perPage, lastPage, currentPage } = result;
    return {
      total,
      perPage,
      lastPage,
      currentPage,
    };
  }
}
