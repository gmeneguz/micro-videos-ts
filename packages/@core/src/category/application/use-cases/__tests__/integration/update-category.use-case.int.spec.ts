import { UpdateCategoryUseCase } from '../../update-category.use-case';
import NotFoundError from '../../../../../@seedwork/errors/not-found-error';
import { CategorySequelize } from '#category/infra';
import { setupSequelizeForTesting } from '#seedwork/infra/testing/helpers/db';
const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;
describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase.UseCase;
  let repo: CategorySequelize.CategorySequelizeRepository;
  setupSequelizeForTesting([CategoryModel]);
  beforeEach(() => {
    repo = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase.UseCase(repo);
  });

  it('should throw error when trying to get an entity that does not exist', async () => {
    await expect(() =>
      useCase.execute({ id: 'fake Id', name: 'fake' }),
    ).rejects.toThrow(new NotFoundError('Entity Not Found with id fake Id'));
  });

  it('should update a category', async () => {
    const [entity] = await CategoryModel.factory().bulkCreate();
    let out = await useCase.execute({
      id: entity.id,
      name: 'test2',
      description: 'desc!',
      is_active: true,
    });
    expect(out.id).toBe(entity.id);

    const found = await CategoryModel.findByPk(entity.id.toString());
    let expected = {
      id: entity.id,
      name: 'test2',
      description: 'desc!',
      is_active: true,
      created_at: entity.created_at,
    };
    expect(found.toJSON()).toStrictEqual(expected);

    out = await useCase.execute({
      id: entity.id,
      name: 'test3',
      description: null,
      is_active: false,
    });
    expected = {
      id: entity.id,
      name: 'test3',
      description: null,
      is_active: false,
      created_at: entity.created_at,
    };

    expect(out).toStrictEqual(expected);
  });
});
