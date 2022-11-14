import { setupSequelizeForTesting } from '#seedwork/infra/testing/helpers/db';
import { DataType, Sequelize } from 'sequelize-typescript';
import { CategorySequelize } from './';
const { CategoryModel } = CategorySequelize;
describe('CAtegoryModel Unit Tests', () => {
  setupSequelizeForTesting([CategoryModel]);
  test('mapping props', () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(attributesMap);
    expect(attributes).toStrictEqual([
      'id',
      'name',
      'description',
      'is_active',
      'created_at',
    ]);
    const idAtt = attributesMap['id'];
    expect(idAtt).toMatchObject({
      field: 'id',
      fieldName: 'id',
      primaryKey: true,
      type: DataType.UUIDV4(),
    });

    const nameAtt = attributesMap['name'];
    expect(nameAtt).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const descriptionAtt = attributesMap['description'];
    expect(descriptionAtt).toMatchObject({
      field: 'description',
      fieldName: 'description',
      type: DataType.TEXT(),
    });

    const isActiveAtt = attributesMap['is_active'];
    expect(isActiveAtt).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      type: DataType.BOOLEAN(),
    });

    const createdAtAtt = attributesMap['created_at'];
    expect(createdAtAtt).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      type: DataType.DATE(),
    });
  });

  it('create', async () => {
    const id = '8ee17fd3-447c-437c-9da6-61dabb0446ba';
    const arrange = {
      id,
      name: 'test',
      is_active: true,
      created_at: new Date(),
    };
    const category = await CategoryModel.create(arrange);
    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
