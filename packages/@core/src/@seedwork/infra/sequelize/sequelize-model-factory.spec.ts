import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { SequelizeModelFactory } from './sequelize-model-factory';
import Chance from 'chance';
import { setupSequelizeForTesting } from '../testing/helpers/db';
const chance = Chance();
@Table
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name;

  static mockFactory = jest.fn(() => {
    return {
      id: chance.guid(),
      name: chance.word(),
    };
  });

  static factory() {
    return new SequelizeModelFactory<StubModel>(
      StubModel,
      StubModel.mockFactory,
    );
  }
}

describe('Sequelize ModelFactory Tests', () => {
  setupSequelizeForTesting([StubModel]);
  test('Create', async () => {
    let model = await StubModel.factory().create();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();
    let modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);
    model = await StubModel.factory().create({
      id: '8ee17fd3-447c-437c-9da6-61dabb0446ba',
      name: 'test',
    });

    expect(model.id).toBe('8ee17fd3-447c-437c-9da6-61dabb0446ba');
    expect(model.name).toBe('test');
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    modelFound = await StubModel.findByPk(
      '8ee17fd3-447c-437c-9da6-61dabb0446ba',
    );
    expect(modelFound.id).toBe('8ee17fd3-447c-437c-9da6-61dabb0446ba');
  });

  test('make', async () => {
    let model = await StubModel.factory().make();
    expect(model.id).not.toBeNull();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();
  });

  test('bulk create count 1 or greather', async () => {
    let models = await StubModel.factory().bulkCreate();
    expect(models).toHaveLength(1);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();

    let modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toBe(modelFound.id);
    expect(models[0].name).toBe(modelFound.name);

    models = await StubModel.factory().bulkCreate(() => ({
      id: '8ee17fd3-447c-437c-9da6-61dabb0446ba',
      name: 'test',
    }));

    expect(models[0].id).toBe('8ee17fd3-447c-437c-9da6-61dabb0446ba');
    expect(models[0].name).toBe('test');
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    modelFound = await StubModel.findByPk(
      '8ee17fd3-447c-437c-9da6-61dabb0446ba',
    );
    expect(modelFound.id).toBe('8ee17fd3-447c-437c-9da6-61dabb0446ba');

    // Greather
    models = await StubModel.factory().count(2).bulkCreate();
    expect(models).toHaveLength(2);

    models = await StubModel.factory()
      .count(2)
      .bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: chance.string(),
      }));
    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBe(models[1].id);
  });

  test('bulk build count 1 or greather', async () => {
    let models = await StubModel.factory().bulkMake();
    expect(models).toHaveLength(1);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();

    models = await StubModel.factory().bulkMake(() => ({
      id: '8ee17fd3-447c-437c-9da6-61dabb0446ba',
      name: 'test',
    }));

    expect(models[0].id).toBe('8ee17fd3-447c-437c-9da6-61dabb0446ba');
    expect(models[0].name).toBe('test');
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    // Greather
    models = await StubModel.factory().count(2).bulkMake();
    expect(models).toHaveLength(2);

    models = await StubModel.factory()
      .count(2)
      .bulkMake(() => ({
        id: chance.guid({ version: 4 }),
        name: chance.string(),
      }));
    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBe(models[1].id);
  });
});
