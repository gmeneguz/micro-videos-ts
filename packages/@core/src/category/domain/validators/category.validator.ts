import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import ClassValidatorFields from "../../../@seedwork/validators/class-validator-fields";
import { CategoryProps } from "../entities/category";

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;

  @IsDate()
  @IsOptional()
  created_at: Date;

  constructor(props: CategoryProps) {
    Object.assign(this, props);
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(data: CategoryProps): boolean {
    return super.validate(new CategoryRules(data));
  }
}

export class CategiryValidatorFactory {
  static create(): CategoryValidator {
    return new CategoryValidator();
  }
}
export default CategiryValidatorFactory;
