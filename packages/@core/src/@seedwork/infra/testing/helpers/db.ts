import { configTest as config } from '#seedwork/infra/config';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

type SequelizeOptionsCfg = Omit<SequelizeOptions, 'models'>;
type SequelizeModels = SequelizeOptions['models'];
const defaultOptions: SequelizeOptionsCfg = {
  dialect: config.db.dialect,
  host: config.db.host,
  logging: config.db.logging,
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
