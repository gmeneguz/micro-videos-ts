import { UniqueEntityId } from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';
import Entity from '../../../@seedwork/domain/entity/entity';
import CategiryValidatorFactory from '../validators/category.validator';
import { EntityValidationError } from '../../../@seedwork/errors/validation-error';
export interface CategoryProps {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}
export class Category extends Entity<CategoryProps> {
  constructor(
    public readonly props: CategoryProps,
    id?: UniqueEntityId | string,
  ) {
    Category.validate(props);
    const uniqueEntityId = typeof id === 'string' ? new UniqueEntityId(id) : id;
    super(props, uniqueEntityId);
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
  update({ name, description }: Pick<Category, 'name' | 'description'>) {
    Category.validate({ name, description });
    this.props.name = name;
    this.description = description;
  }

  // static validate(props: Omit<CategoryProps, "id" | "created_at">) {
  //   ValidatorRules.values(props.name, "name")
  //     .required()
  //     .string()
  //     .maxLength(255);
  //   ValidatorRules.values(props.description, "description").string();
  //   ValidatorRules.values(props.is_active, "is_active").boolean();
  // }

  static validate(props: Omit<CategoryProps, 'id' | 'created_at'>) {
    const validator = CategiryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  activate() {
    this.is_active = true;
  }
  deactivate() {
    this.is_active = false;
  }
}
