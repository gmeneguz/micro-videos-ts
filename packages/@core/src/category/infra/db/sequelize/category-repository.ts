import { Category, CategoryRepository } from '#category/domain';
import { UniqueEntityId } from '#seedwork/domain';
import NotFoundError from '#seedwork/errors/not-found-error';
import { Op, Order } from 'sequelize';
import { CategoryMapper } from './category-mapper';
import { CategoryModel } from './category-model';

export class CategorySequelizeRepository
  implements CategoryRepository.Repository
{
  constructor(private categoryModel: typeof CategoryModel) {}

  sortableFields: string[] = ['name', 'created_at'];
  async search(
    props: CategoryRepository.SearchParams,
  ): Promise<CategoryRepository.SearchResult> {
    const where = props.filter
      ? {
          where: {
            name: {
              [Op.like]: `%${props.filter}%`,
            },
          },
        }
      : null;

    const order: Order =
      props.sortBy && this.sortableFields.includes(props.sortBy)
        ? [[props.sortBy, props.sortDir]]
        : [['created_at', 'DESC']];

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...where,
      order,
      limit: props.limit,
      offset: props.limit * (props.page - 1),
    });
    return new CategoryRepository.SearchResult({
      items: models.map(CategoryMapper.toEntity),
      currentPage: props.page,
      perPage: props.limit,
      total: count,
      filter: props.filter,
      sort: props.sortBy,
      sortDir: props.sortDir,
    });
  }
  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create(entity.toJSON());
  }

  async findById(id: string | UniqueEntityId): Promise<Category> {
    const model = await this._get(`${id}`);
    return CategoryMapper.toEntity(model);
  }

  async findaAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map(CategoryMapper.toEntity);
  }
  update(entity: Category): Promise<void> {
    throw new Error('Method not implemented.');
  }
  private async _get(id: string): Promise<CategoryModel> {
    return this.categoryModel.findByPk(`${id}`, {
      rejectOnEmpty: new NotFoundError(`Entity Not Found with id ${id}`),
    });
  }
  delete(id: string | UniqueEntityId): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
