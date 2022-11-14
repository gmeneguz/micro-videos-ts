import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

type SequelizeOptionsCfg = Omit<SequelizeOptions, 'models'>;
type SequelizeModels = SequelizeOptions['models'];
const defaultOptions: SequelizeOptionsCfg = {
  dialect: 'sqlite',
  host: ':memory:',
  logging: false,
};

export function setupSequelizeForTesting(
  models: SequelizeModels,
  options: SequelizeOptionsCfg = defaultOptions,
) {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize({ ...options, models });
  });
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });
  afterAll(async () => {
    await sequelize.close();
  });
  return {
    get sequelize() {
      return sequelize;
    },
  };
}
