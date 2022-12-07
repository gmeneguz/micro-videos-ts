import { Category, CategoryRepository } from '#category/domain';
import { UniqueEntityId } from '#seedwork/domain';
import { NotFoundError } from '#seedwork/errors';
import { setupSequelizeForTesting } from '#seedwork/infra/testing/helpers/db';
import _chance from 'chance';
import { CategorySequelize } from './category-sequelize';

const { CategoryModel, CategoryMapper, CategorySequelizeRepository } =
  CategorySequelize;
describe('CategorySequelizeRepo Unit Tests', () => {
  let chance: Chance.Chance;
  setupSequelizeForTesting([CategoryModel]);
  let repo: CategorySequelize.CategorySequelizeRepository;

  beforeAll(() => {
    chance = _chance();
  });
  beforeEach(async () => {
    repo = new CategorySequelizeRepository(CategoryModel);
  });

  it('should create a new entity', async () => {
    let category = new Category({ name: 'Movie' });
    await repo.insert(category);
    const found = await CategoryModel.findByPk(category.id);
    expect(found.toJSON()).toStrictEqual(category.toJSON());
  });

  it('should throw error entity not found', async () => {
    await expect(() => repo.findById('fake id')).rejects.toThrowError(
      new NotFoundError('Entity Not Found with id fake id'),
    );
    const uuid = new UniqueEntityId();
    await expect(() => repo.findById(uuid)).rejects.toThrowError(
      new NotFoundError(`Entity Not Found with id ${uuid}`),
    );
  });

  it('should find entity by id', async () => {
    const entity = new Category({ name: 'abc' });
    await repo.insert(entity);

    const result = await repo.findById(entity.id);
    const result2 = await repo.findById(entity.uniqueEntityId);

    expect(result.toJSON()).toStrictEqual(entity.toJSON());
    expect(result2.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should return all categories', async () => {
    const entity = new Category({ name: 'abc' });
    await repo.insert(entity);

    const list = await repo.findaAll();

    expect(list).toHaveLength(1);
    expect(list[0].toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should update a category', async () => {
    let model = await CategoryModel.create({
      id: '8ee17fd3-447c-437c-9da6-61dabb0446ba',
      name: 'abc',
      description: null,
      is_active: true,
      created_at: new Date(),
    });
    model.name = 'changed';
    await repo.update(CategoryMapper.toEntity(model));
    model = await CategoryModel.findByPk(model.id);
    expect(model.name).toBe('changed');

    model = CategoryModel.build({
      id: '99917fd3-447c-437c-9da6-61dabb0446ba',
      name: 'abc',
      description: null,
      is_active: true,
      created_at: new Date(),
    });
    await expect(() =>
      repo.update(CategoryMapper.toEntity(model)),
    ).rejects.toThrowError(
      new NotFoundError(
        'Entity Not Found with id 99917fd3-447c-437c-9da6-61dabb0446ba',
      ),
    );
  });

  it('should delete a category', async () => {
    let entity = await CategoryModel.create({
      id: '8ee17fd3-447c-437c-9da6-61dabb0446ba',
      name: 'abc',
      description: null,
      is_active: true,
      created_at: new Date(),
    });
    await repo.delete(entity.id);
    entity = await CategoryModel.findByPk(entity.id);
    expect(entity).toBeNull();
  });

  describe('search method tests', () => {
    it('should apply pagionate only other params are null', async () => {
      const created_at = new Date();
      await CategoryModel.factory()
        .count(16)
        .bulkCreate(() => ({
          id: chance.guid(),
          name: 'movie',
          description: null,
          is_active: true,
          created_at,
        }));
      let result = await repo.search(new CategoryRepository.SearchParams());
      expect(result).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(result.toJSON()).toMatchObject({
        total: 16,
        currentPage: 1,

        perPage: 15,
        sort: null,
        sortDir: null,
        filter: null,
      });
      expect(result.items).toHaveLength(15);
      result.items.forEach((i) => {
        expect(i).toBeInstanceOf(Category);
        expect(i.id).toBeDefined();
        expect(i.toJSON()).toMatchObject({
          name: 'movie',
          description: null,
          is_active: true,
          created_at,
        });
      });
    });
    it('should order by created_at DESC when params are null', async () => {
      const created_at = new Date();
      await CategoryModel.factory()
        .count(16)
        .bulkCreate((index) => ({
          id: chance.guid(),
          name: `Movie${index}`,
          description: null,
          is_active: true,
          created_at: new Date(created_at.getTime() + 100 + index),
        }));
      const searchOut = await repo.search(
        new CategoryRepository.SearchParams(),
      );
      const items = searchOut.items.reverse();
      items.forEach((item, index) => {
        expect(item.name).toBe(`Movie${index + 1}`);
      });
    });
    it('should apply paginate and filter', async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };
      const catProps = [
        { id: chance.guid(), name: 'test', ...defaultProps },
        { id: chance.guid(), name: 'a', ...defaultProps },
        { id: chance.guid(), name: 'TEST', ...defaultProps },
        { id: chance.guid(), name: 'Test', ...defaultProps },
      ];
      await CategoryModel.bulkCreate(catProps);
      let result = await repo.search(
        new CategoryRepository.SearchParams({
          page: 1,
          limit: 2,
          filter: 'TEST',
        }),
      );
      expect(result.items).toHaveLength(2);
      expect(result.items[0].id).toBe(catProps[0].id);
      expect(result.items[1].id).toBe(catProps[2].id);
    });

    it('should apply paginate and order', async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };
      const catProps = [
        { id: chance.guid(), name: 'b', ...defaultProps },
        { id: chance.guid(), name: 'a', ...defaultProps },
        { id: chance.guid(), name: 'd', ...defaultProps },
        { id: chance.guid(), name: 'c', ...defaultProps },
      ];
      await CategoryModel.bulkCreate(catProps);
      let result = await repo.search(
        new CategoryRepository.SearchParams({
          page: 1,
          limit: 3,
          sortBy: 'name',
        }),
      );
      expect(result.items).toHaveLength(3);
      expect(result.items[0].id).toBe(catProps[1].id);
      expect(result.items[1].id).toBe(catProps[0].id);
      expect(result.items[2].id).toBe(catProps[3].id);
    });

    it('should apply paginate, filter and order', async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };
      const catProps = [
        { id: chance.guid(), name: 'Test4', ...defaultProps },
        { id: chance.guid(), name: 'Test2', ...defaultProps },
        { id: chance.guid(), name: 'cccc', ...defaultProps },
        { id: chance.guid(), name: 'Test1', ...defaultProps },
        { id: chance.guid(), name: 'Test0', ...defaultProps },
      ];
      await CategoryModel.bulkCreate(catProps);
      let result = await repo.search(
        new CategoryRepository.SearchParams({
          page: 1,
          limit: 3,
          sortBy: 'name',
          filter: 'Test',
        }),
      );
      expect(result.items).toHaveLength(3);
      expect(result.items[0].id).toBe(catProps[4].id);
      expect(result.items[1].id).toBe(catProps[3].id);
      expect(result.items[2].id).toBe(catProps[1].id);
    });
  });
});
