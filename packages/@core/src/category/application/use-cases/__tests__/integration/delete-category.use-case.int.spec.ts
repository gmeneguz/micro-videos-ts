import { DeleteCategoryUseCase } from '../../delete-category.use-case';
import NotFoundError from '../../../../../@seedwork/errors/not-found-error';
import { CategorySequelize } from '#category/infra';
import { setupSequelizeForTesting } from '#seedwork/infra/testing/helpers/db';
const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;
describe('DeleteCategoryUseCase Integration Tests', () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repo: CategorySequelize.CategorySequelizeRepository;
  setupSequelizeForTesting([CategoryModel]);
  beforeEach(() => {
    repo = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase.UseCase(repo);
  });

  it('should throw error when deleting an entity that not exists', async () => {
    await expect(() => useCase.execute({ id: 'fake Id' })).rejects.toThrow(
      new NotFoundError('Entity Not Found with id fake Id'),
    );
  });

  it('should exclude a category', async () => {
    const model = await CategoryModel.factory().create();

    await useCase.execute({ id: model.id });
    const result = await CategoryModel.findByPk(model.id.toString());
    expect(result).toBe(null);
  });
});
