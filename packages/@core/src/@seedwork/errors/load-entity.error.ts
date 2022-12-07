import { FieldsErrors } from '#seedwork/validators';

export class LoadEntityError extends Error {
  constructor(public error: FieldsErrors, message?: string) {
    super(message ?? 'An entity has not been loaded');
    this.name = 'LoadEntityError';
  }
}
