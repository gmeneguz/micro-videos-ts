import { CreateCategoryUseCase } from '../../create-category.use-case';
import CategoryInMemoryRepository from '../../../../infra/db/in-memory/category-in-memory.repository';
import { CategorySequelize } from '#category/infra';
import { setupSequelizeForTesting } from '#seedwork/infra/testing/helpers/db';
const { CategoryModel, CategorySequelizeRepository } = CategorySequelize;

describe('CreateCategoryUseCase Integration Tests', () => {
  let useCase: CreateCategoryUseCase.UseCase;
  let repo: CategorySequelize.CategorySequelizeRepository;

  setupSequelizeForTesting([CategoryModel]);
  beforeEach(() => {
    repo = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase.UseCase(repo);
  });

  describe('Create Category with test each', () => {
    const arrange = [
      {
        input: { name: 'test' },
        output: { name: 'test', description: null, is_active: true },
      },
      {
        input: { name: 'test2', description: 'descTest', is_active: false },
        output: { name: 'test2', description: 'descTest', is_active: false },
      },
    ];
    test.each(arrange)(
      'input $input, output $output',
      async ({ input, output }) => {
        let out = await useCase.execute(input);
        let entity = await repo.findById(out.id);
        expect(out.id).toBe(entity.id);
        expect(out.created_at).toStrictEqual(entity.created_at);
        expect(out).toMatchObject(output);
      },
    );
  });

  // it('should create a category', async () => {
  //   let out = await useCase.execute({ name: 'test' });
  //   let entity = await repo.findById(out.id);

  //   expect(out).toStrictEqual({
  //     id: entity.id,
  //     name: 'test',
  //     description: null,
  //     is_active: true,
  //     created_at: entity.props.created_at,
  //   });
  // });
});
