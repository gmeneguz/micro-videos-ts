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
    return new SequelizeModelFactory(StubModel, StubModel.mockFactory);
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
});
