import ClassValidatorFields from "../validators/class-validator-fields";
import { FieldsErrors } from "../validators/validator-fields-interface";
import { objectContaining } from "expect";
import { EntityValidationError } from "@seedwork/errors/validation-error";
type Expected =
  | {
      validator: ClassValidatorFields<any>;
      data: any;
    }
  | (() => any);

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors) {
    if (typeof expected === "function") {
      try {
        expected();
        return isValidResponse();
      } catch (e) {
        const error = e as EntityValidationError;
        const isMatch = objectContaining(received).asymmetricMatch(error.error);
        return issMatchResponse(isMatch, received, error.error);
      }
    } else {
      const { validator, data } = expected;
      const isValid = validator.validate(data);

      if (isValid) {
        return isValidResponse();
      }
      const isMatch = objectContaining(received).asymmetricMatch(
        validator.errors
      );
      return issMatchResponse(isMatch, received, validator.errors);
    }
  },
});

function isValidResponse() {
  return {
    pass: false,
    message: () => "the data is valid",
  };
}
function issMatchResponse(
  isMatch: boolean,
  received: FieldsErrors,
  errors: FieldsErrors
) {
  return isMatch
    ? { pass: true, message: () => "" }
    : {
        pass: false,
        message: () =>
          `The validation errors not contains ${JSON.stringify(
            received
          )}. Current: ${JSON.stringify(errors)}`,
      };
}
