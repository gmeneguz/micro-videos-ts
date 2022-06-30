import Entity from "../domain/entity/entity";
import { UniqueEntityId } from "../domain/value-objects/unique-entity-id.vo";
import {
  RepositoryInterface,
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from "./repository-contracts";
import NotFoundError from "../errors/not-found-error";

export abstract class InMemoryRepository<E extends Entity<any>>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }
  async findById(id: string | UniqueEntityId): Promise<E> {
    const _id = `${id}`;
    return this._get(_id);
  }
  async findaAll(): Promise<E[]> {
    return this.items;
  }
  async update(entity: E): Promise<void> {
    let item = await this._get(entity.id);
    const index = this.items.findIndex((i) => i === item);

    this.items[index] = entity;
  }
  async delete(id: string | UniqueEntityId): Promise<void> {
    const _id = `${id}`;
    const item = await this._get(_id);
    let index = this.items.findIndex((e) => e === item);

    this.items.splice(index, 1);
  }
  protected async _get(id: string): Promise<E> {
    const item = this.items.find((i) => i.id === id);
    if (!item) {
      throw new NotFoundError(`Entity Not Found with id ${id}`);
    }
    return item;
  }
}

export abstract class InMemorySearchableRepository<E extends Entity<any>>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E>
{
  sortableFields: string[];

  async search(props: SearchParams): Promise<SearchResult<E>> {
    const filteredItems = await this.applyFilter(this.items, props.filter);
    const sortedItems = await this.applySort(
      filteredItems,
      props.sortBy,
      props.sortDir
    );
    const pageItems = await this.applyPaginate(
      sortedItems,
      props.page,
      props.limit
    );
    return new SearchResult({
      items: pageItems,
      total: filteredItems.length,
      currentPage: props.page,
      perPage: props.limit,
      sort: props.sortBy,
      sortDir: props.sortDir,
      filter: props.filter,
    });
  }
  protected abstract applyFilter(
    items: E[],
    filter: SearchParams["filter"]
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    sort?: SearchParams["sortBy"],
    sortDir?: SearchParams["sortDir"]
  ): Promise<E[]> {
    if (!sort || !this.sortableFields || !this.sortableFields.includes(sort)) {
      return items;
    }
    return [...items].sort((a, b) => {
      if (a.props[sort] > b.props[sort]) {
        return sortDir === "desc" ? -1 : 1;
      }
      if (a.props[sort] < b.props[sort]) {
        return sortDir === "desc" ? 1 : -1;
      }
      return 0;
    });
  }

  protected async applyPaginate(
    items: E[],
    page: number,
    perPage: number
  ): Promise<E[]> {
    const startIndex = (page - 1) * perPage;
    return items.slice(startIndex, startIndex + perPage);
  }
}
