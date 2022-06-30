import { FieldsErrors } from "@seedwork/validators/validator-fields-interface";

export class ValidationError extends Error {}

export class EntityValidationError extends Error {
  constructor(public error: FieldsErrors) {
    super("entity validation error");
    this.name = "EntityValidationError";
  }
}
