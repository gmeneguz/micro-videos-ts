import {
  EntityValidationError,
  LoadEntityError,
  NotFoundError,
} from '#seedwork/errors';
import { Category, CategoryRepository } from '#category/domain';
import { UniqueEntityId } from '#seedwork/domain';
import { Op, Order } from 'sequelize';

import { SequelizeModelFactory } from '#seedwork/infra/sequelize';
import {
  AllowNull,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

type CategoryModelProps = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};

export namespace CategorySequelize {
  export class CategoryMapper {
    static toEntity(model: CategoryModel): Category {
      const { id, ...rest } = model.toJSON();
      try {
        return new Category(rest, new UniqueEntityId(id));
      } catch (error) {
        if (error instanceof EntityValidationError) {
          throw new LoadEntityError(error.error);
        }
        throw error;
      }
    }
  }

  @Table({ tableName: 'categories', timestamps: false })
  export class CategoryModel extends Model<CategoryModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUIDV4 })
    id: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING(255) })
    name: string;

    @Column({ type: DataType.TEXT })
    description: string | null;

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    is_active: boolean;

    @Column({ allowNull: false, type: DataType.DATE })
    created_at: Date;

    static factory() {
      const chance: Chance.Chance = require('chance')();

      return new SequelizeModelFactory<CategoryModel, CategoryModelProps>(
        CategoryModel,
        () => ({
          id: chance.guid(),
          name: chance.word(),
          description: chance.paragraph(),
          is_active: true,
          created_at: chance.date(),
        }),
      );
    }
  }

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
    async update(entity: Category): Promise<void> {
      await this._get(entity.id);
      await this.categoryModel.update(entity.toJSON(), {
        where: {
          id: entity.id,
        },
      });
    }
    private _get(id: string): Promise<CategoryModel> {
      return this.categoryModel.findByPk(`${id}`, {
        rejectOnEmpty: new NotFoundError(`Entity Not Found with id ${id}`),
      });
    }
    async delete(id: string | UniqueEntityId): Promise<void> {
      const _id = `${id}`;
      await this._get(_id);
      await this.categoryModel.destroy({ where: { id: _id } });
    }
  }
}
