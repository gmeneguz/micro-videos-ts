export class SequelizeModelFactory {
  constructor(private model, private factoryProps: () => any) {}
  async create(data?) {
    return this.model.create(data || this.factoryProps());
  }
  async bulkCreate() {}

  make(data?) {
    return this.model.build(data || this.factoryProps());
  }
  bulkMake() {}
}
