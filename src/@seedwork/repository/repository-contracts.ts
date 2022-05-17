import Entity from "../domain/entity/entity";
import { UniqueEntityId } from "../domain/value-objects/unique-entity-id.vo";
export interface RepositoryInterface<E extends Entity<any>> {
  insert(entity: E): Promise<void>;
  findById(id: string | UniqueEntityId): Promise<E | null>;
  findaAll(): Promise<E[]>;
  update(ntity: E): Promise<void>;
  delete(id: string | UniqueEntityId): Promise<void>;
}

export type SortDirection = "asc" | "desc";
export type SearchProps<Filter = string> = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: SortDirection;
  filter?: Filter;
};
export class SearchParams<Filter = string> {
  protected _page: number = 1;
  protected _limit: number = 15;
  protected _sortBy: string | null;
  protected _sortDir: SortDirection | null;
  protected _filter: Filter | null;
  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page;
    this.limit = props.limit;
    this.sortBy = props.sortBy;
    this.sortDir = props.sortDir;
    this.filter = props.filter;
  }

  get page(): number {
    return this._page;
  }
  set page(value: number) {
    let _page = +value;
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }
    this._page = _page;
  }

  get limit(): number {
    return this._limit;
  }
  set limit(value: number) {
    let _limit = +value;
    if (
      Number.isNaN(_limit) ||
      _limit <= 0 ||
      parseInt(_limit as any) !== _limit
    ) {
      _limit = this._limit;
    }
    this._limit = _limit;
  }

  get sortBy(): string {
    return this._sortBy;
  }
  set sortBy(value: string) {
    this._sortBy = value ? `${value}` : null;
    this.sortDir = this._sortDir;
  }

  get sortDir(): SortDirection {
    return this._sortDir;
  }
  set sortDir(value: SortDirection) {
    if (!this._sortBy) {
      this._sortDir = null;
      return;
    }
    this._sortDir = `${value}`.toLowerCase() === "desc" ? "desc" : "asc";
  }

  get filter(): Filter | null {
    return this._filter;
  }
  set filter(value: Filter) {
    this._filter = value ? (`${value}` as any) : null;
  }
}

type SearchResultProps<E extends Entity<any>, Filter> = {
  items: E[];
  total: number;
  currentPage: number;
  perPage: number;
  sort?: string;
  sortDir?: SortDirection;
  filter: Filter;
};

export class SearchResult<E extends Entity<any>, Filter = string> {
  readonly items: E[];
  readonly total: number;
  readonly currentPage: number;
  readonly perPage: number;
  readonly lastPage: number;
  readonly sort?: string;
  readonly sortDir?: SortDirection;
  readonly filter: Filter;

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.perPage = props.perPage;
    this.lastPage = Math.ceil(this.total / this.perPage);
    this.sort = props.sort;
    this.sortDir = props.sortDir;
    this.filter = props.filter;
  }
  toJSON() {
    return {
      items: this.items,
      total: this.total,
      currentPage: this.currentPage,
      perPage: this.perPage,
      lastPage: this.lastPage,
      sort: this.sort,
      sortDir: this.sortDir,
      filter: this.filter,
    };
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity<any>,
  Filter = string,
  SP = SearchParams,
  SR = SearchResult<E, Filter>
> extends RepositoryInterface<E> {
  sortableFields: string[];
  search(props: SP): Promise<SR>;
}
