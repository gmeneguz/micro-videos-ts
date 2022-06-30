import { SortDirection } from "../../repository/repository-contracts";

export type SearchInputDto<Filter = string> = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: SortDirection;
  filter?: Filter | null;
};
