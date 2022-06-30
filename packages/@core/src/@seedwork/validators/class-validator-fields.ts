import { validateSync } from "class-validator";
import ValidatorFieldsInterface, {
  FieldsErrors,
} from "./validator-fields-interface";

export abstract class ClassValidatorFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: FieldsErrors = null;
  validateData: PropsValidated = null;
  validate(data: any): boolean {
    const errorsResult = validateSync(data);
    if (errorsResult.length) {
      this.errors = {};
      for (const error of errorsResult) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints);
      }
    } else {
      this.validateData = data;
    }
    return !errorsResult.length;
  }
}
export default ClassValidatorFields;
