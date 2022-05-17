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

  export abstract class Repository
    implements
      SearchableRepositoryInterface<
        Category,
        Filter,
        SearchParams,
        SearchResult
      >
  {
    sortableFields: string[];
    search(props: SearchParams): Promise<SearchResult> {
      throw new Error("Method not implemented.");
    }
    insert(entity: Category): Promise<void> {
      throw new Error("Method not implemented.");
    }
    findById(id: string | UniqueEntityId): Promise<Category> {
      throw new Error("Method not implemented.");
    }
    findaAll(): Promise<Category[]> {
      throw new Error("Method not implemented.");
    }
    update(ntity: Category): Promise<void> {
      throw new Error("Method not implemented.");
    }
    delete(id: string | UniqueEntityId): Promise<void> {
      throw new Error("Method not implemented.");
    }
  }
}

export default CategoryRepository;
