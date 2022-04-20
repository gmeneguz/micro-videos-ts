import { UniqueEntityId } from "../value-objects/unique-entity-id.vo";

export default abstract class Entity<Props> {
  public readonly uniqueEntityId: UniqueEntityId;
  constructor(public readonly props: Props, uniqueEntityId?: UniqueEntityId) {
    this.uniqueEntityId = uniqueEntityId || new UniqueEntityId();
  }

  get id(): string {
    return this.uniqueEntityId.value;
  }

  toJSON() {
    return {
      id: this.id,
      ...this.props,
    };
  }
}
