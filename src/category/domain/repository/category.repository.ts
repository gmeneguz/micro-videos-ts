import {
  InMemoryRepository,
  InMemorySearchableRepository,
} from "@seedwork/repository/in-memory-repository";
import { UniqueEntityId } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "../../../@seedwork/repository/repository-contracts";
import Category from "../entities/category";

export namespace CategoryRepository {
  export type Filter = string;
  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<Category, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Category,
      Filter,
      SearchParams,
      SearchResult
    > {
    sortableFields: string[];
  }
}

export default CategoryRepository;
