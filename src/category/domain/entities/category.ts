import { UniqueEntityId } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import Entity from "../../../@seedwork/domain/entity/entity";
export interface CategoryProps {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}
export default class Category extends Entity<CategoryProps> {
  constructor(public readonly props: CategoryProps, id?: UniqueEntityId) {
    super(props, id);
    this.props.is_active = this.props.is_active ?? true;
    this.props.description = this.props.description ?? null;
    this.props.created_at = this.props.created_at ?? new Date();
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  set description(value: string) {
    this.props.description = value ?? null;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }
  set is_active(value: boolean) {
    this.props.is_active = value;
  }
  get created_at(): Date | undefined {
    return this.props.created_at;
  }
  update({ name, description }: Pick<Category, "name" | "description">) {
    this.props.name = name;
    this.description = description;
  }
  activate() {
    this.is_active = true;
  }
  deactivate() {
    this.is_active = false;
  }
}
