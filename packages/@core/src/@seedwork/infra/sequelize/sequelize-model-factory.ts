import { Model } from 'sequelize-typescript';

export class SequelizeModelFactory<ModelClass extends Model, ModelProps = any> {
  private _count = 1;
  constructor(private model, private factoryProps: () => ModelProps) {}

  async create(data?: ModelProps): Promise<ModelClass> {
    return this.model.create(data || this.factoryProps());
  }
  async bulkCreate(
    factoryProps?: (index: number) => ModelProps,
  ): Promise<ModelClass[]> {
    const data = new Array(this._count)
      .fill(factoryProps || this.factoryProps)
      .map((factory, index) => {
        return factory(index);
      });
    return this.model.bulkCreate(data);
  }

  count(count: number) {
    this._count = count;
    return this;
  }
  make(data?: ModelProps): ModelClass {
    return this.model.build(data || this.factoryProps());
  }
  bulkMake(factoryProps?: (index: number) => ModelProps): ModelClass[] {
    const data = new Array(this._count)
      .fill(factoryProps || this.factoryProps)
      .map((factory, index) => {
        return factory(index);
      });
    return this.model.bulkBuild(data);
  }
}
