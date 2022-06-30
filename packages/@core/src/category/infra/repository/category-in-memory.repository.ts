import { InMemorySearchableRepository } from "../../../@seedwork/repository/in-memory-repository";
import { Category } from "#category/domain/entities/category";
import { CategoryRepository } from "../../domain/repository/category.repository";

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  sortableFields = ["name", "created_at"];

  async search(
    props: CategoryRepository.SearchParams
  ): Promise<CategoryRepository.SearchResult> {
    let inProps = props;

    if (!inProps.sortBy) {
      inProps.sortBy = "created_at";
    }

    return super.search(inProps);
  }

  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.Filter
  ): Promise<Category[]> {
    if (!filter) return Promise.resolve(items);
    return Promise.resolve(
      items.filter((i) =>
        i.props.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }
}

export default CategoryInMemoryRepository;
