import { ListCategoryUseCase } from '../../list-category.use-case.ts';
import { CategorySequelize } from '#category/infra';
import { setupSequelizeForTesting } from '#seedwork/infra/testing/helpers/db';
const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;

describe('ListCategoryUseCase Integration Tests', () => {
  let useCase: ListCategoryUseCase.UseCase;
  let repo: CategorySequelize.CategorySequelizeRepository;

  setupSequelizeForTesting([CategoryModel]);

  beforeEach(() => {
    repo = new CategorySequelizeRepository(CategoryModel);
    useCase = new ListCategoryUseCase.UseCase(repo);
  });

  it('should return list with empty input', async () => {
    const created_at = new Date();
    const created_at2 = new Date(created_at.getTime() - 100);
    const items = await CategoryModel.factory()
      .count(2)
      .bulkCreate((index) => {
        return index === 0
          ? {
              id: '8ee17fd3-447c-437c-9da6-61dabb0446ba',
              name: 'movie',
              description: 'desc',
              is_active: true,
              created_at: created_at2,
            }
          : {
              id: '8ee17fd3-447c-437c-9da6-61dabb0446bb',
              name: 'movie2',
              description: 'desc2',
              is_active: true,
              created_at: created_at,
            };
      });

    const out = await useCase.execute({});
    console.log({
      out: out.items,
      expected: [...items].reverse().map((e) => e.toJSON()),
    });
    expect({ ...out }).toMatchObject({
      items: [...items].reverse().map((e) => e.toJSON()),
      total: 2,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    });
  });

  it('should apply filter and sort', async () => {
    const arrange = [
      { name: 'aaa' },
      { name: 'ddd' },
      { name: 'ccc' },
      { name: 'azz' },
    ];
    const items = await CategoryModel.factory()
      .count(arrange.length)
      .bulkCreate((idx) => ({
        id: '8ee17fd3-447c-437c-9da6-61dabb0446b' + idx,
        name: arrange[idx].name,
        description: null,
        is_active: true,
        created_at: new Date(),
      }));
    let out = await useCase.execute({
      page: 1,
      limit: 2,
      filter: 'a',
      sortBy: 'name',
      sortDir: 'asc',
    });
    expect(out).toMatchObject({
      items: [items[0].toJSON(), items[3].toJSON()],
      total: 2,
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
    });

    out = await useCase.execute({
      page: 1,
      limit: 2,
      filter: null,
      sortBy: 'name',
      sortDir: 'desc',
    });
    expect(out).toMatchObject({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 4,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });
  });
});
