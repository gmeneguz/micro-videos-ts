import { GetCategoryUseCase } from '../../get-category.use-case';
import NotFoundError from '../../../../../@seedwork/errors/not-found-error';
import { CategorySequelize } from '#category/infra';
import { setupSequelizeForTesting } from '#seedwork/infra/testing/helpers/db';
const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;
describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase.UseCase;
  let repo: CategorySequelize.CategorySequelizeRepository;
  setupSequelizeForTesting([CategoryModel]);
  beforeEach(() => {
    repo = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase.UseCase(repo);
  });

  it('should throw error when trying to get an entity that does not exist', async () => {
    await expect(() => useCase.execute({ id: 'fake Id' })).rejects.toThrow(
      new NotFoundError('Entity Not Found with id fake Id'),
    );
  });

  it('should get a category', async () => {
    const model = await CategoryModel.factory().create();
    const found = await useCase.execute({ id: model.id });
    expect(found).toStrictEqual(model.toJSON());
  });
});
