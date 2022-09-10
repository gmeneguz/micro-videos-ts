import { Category } from '#category/domain';
import { UniqueEntityId } from '#seedwork/domain';
import NotFoundError from '#seedwork/errors/not-found-error';
import { setupSequelizeForTesting } from '#seedwork/infra/testing/helpers/db';
import { Sequelize } from 'sequelize-typescript';
import { CategoryModel } from './category-model';
import { CategorySequelizeRepository } from './category-repository';

describe('CategorySequelizeRepo Unit Tests', () => {
  setupSequelizeForTesting([CategoryModel]);
  let repo: CategorySequelizeRepository;

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
  it('should search', async () => {
    await CategoryModel.factory().create();
    const res = await CategoryModel.findAll();
    console.log(res[0].toJSON());
  });
});
