import { Category } from '#category/domain';
import { UniqueEntityId } from '#seedwork/domain';
import { EntityValidationError, LoadEntityError } from '#seedwork/errors';
import { CategoryModel } from './category-model';

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
