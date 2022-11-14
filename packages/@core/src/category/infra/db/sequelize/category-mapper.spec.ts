import { Category } from '#category/domain';
import { LoadEntityError } from '#seedwork/errors';
import { setupSequelizeForTesting } from '#seedwork/infra/testing/helpers/db';
import { CategorySequelize } from './';
const { CategoryModel, CategoryMapper } = CategorySequelize;

describe('CategryModelMapper Unit Tests', () => {
  setupSequelizeForTesting([CategoryModel]);

  it('it should throw error when category is ivalid', () => {
    const model = CategoryModel.build({
      id: '8ee17fd3-447c-437c-9da6-61dabb0446ba',
    });
    try {
      CategoryMapper.toEntity(model);
      fail('should throw error with invalid Category');
    } catch (error) {
      expect(error).toBeInstanceOf(LoadEntityError);
      expect(error.error).toMatchObject({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });
    }
  });
  it('it should throw a generic error', () => {
    const genericError = new Error('Generic Error');
    const spyValidate = jest
      .spyOn(Category, 'validate')
      .mockImplementation(() => {
        throw genericError;
      });
    const model = CategoryModel.build({
      id: '8ee17fd3-447c-437c-9da6-61dabb0446ba',
    });

    expect(() => CategoryMapper.toEntity(model)).toThrow(genericError);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it('it should map category model to entity', () => {
    const modelData = {
      id: '8ee17fd3-447c-437c-9da6-61dabb0446ba',
      name: 'aaa',
      description: 'ok',
      created_at: new Date(),
      is_active: false,
    };
    const model = CategoryModel.build(modelData);

    expect(CategoryMapper.toEntity(model).toJSON()).toStrictEqual(
      new Category(modelData).toJSON(),
    );
  });
});
