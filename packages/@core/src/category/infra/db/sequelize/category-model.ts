import { SequelizeModelFactory } from '#seedwork/infra/sequelize/sequelize-model-factory';
import {
  AllowNull,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

type CategoryModelProps = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};

@Table({ tableName: 'categories', timestamps: false })
export class CategoryModel extends Model<CategoryModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUIDV4 })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  name: string;

  @Column({ type: DataType.TEXT })
  description: string | null;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  is_active: boolean;

  @Column({ allowNull: false, type: DataType.DATE })
  created_at: Date;

  static factory() {
    const chance: Chance.Chance = require('chance')();

    return new SequelizeModelFactory(CategoryModel, () => ({
      id: chance.guid(),
      name: chance.word(),
      description: chance.paragraph(),
      is_active: true,
      created_at: chance.date(),
    }));
  }
}
