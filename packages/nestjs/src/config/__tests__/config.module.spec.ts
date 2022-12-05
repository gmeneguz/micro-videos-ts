import { Test } from '@nestjs/testing';
import Joi from 'joi';
import { join } from 'path';
import { ConfigModule, CONFIG_DB_SCHEMA } from '../config.module';

function expectSchemaError(schema: Joi.Schema, value: any) {
  return expect(schema.validate(value, { abortEarly: false }).error.message);
}

describe('Schema Unit Test', () => {
  describe('DB SCHEMA', () => {
    const schema = Joi.object({ ...CONFIG_DB_SCHEMA });
    describe('DB_DIALECT', () => {
      test('invalid case - required', () => {
        expectSchemaError(schema, {}).toContain('"DB_DIALECT" is required');
      });
      test('invalid case - invalid value', () => {
        expectSchemaError(schema, { DB_DIALECT: 'aa' }).toContain(
          '"DB_DIALECT" must be one of',
        );
      });
    });
    describe('DB_DATABASE', () => {
      test('invalid cases', () => {
        expectSchemaError(schema, { dialect: 'sqlite' }).not.toContain(
          '"DB_DATABASE" is required',
        );
      });
      test('invalid cases', () => {
        expectSchemaError(schema, { DB_DIALECT: 'mysql' }).toContain(
          '"DB_DATABASE" is required',
        );
      });
      test('invalid case', () => {
        expectSchemaError(schema, {
          DB_DIALECT: 'mysql',
          DB_DATABASE: 1,
        }).toContain('"DB_DATABASE" must be a string');
      });
      test('valid cases', () => {
        const arrange = [
          { DB_DIALECT: 'sqlite' },
          { DB_DIALECT: 'sqlite', DB_DATABASE: '123' },
          { DB_DIALECT: 'mysql', DB_DATABASE: '123' },
        ];
        arrange.forEach((item) => {
          expectSchemaError(schema, {
            DB_DIALECT: item.DB_DIALECT,
            DB_DATABASE: item.DB_DATABASE,
          }).not.toContain('"DB_DATABASE"');
        });
      });
    });
  });
});

describe('ConfigModule Unit Tests', () => {
  it('should throw error when invalid config', () => {
    try {
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ envFilePath: join(__dirname, '.env.fake') }),
        ],
      });
      fail('should throw an error when env var are invalid');
    } catch (error) {
      expect(error.message).toContain('"DB_DIALECT" must be one of');
    }
  });
  it('should create config module', () => {
    const module = Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    });
    expect(module).toBeDefined();
  });
});
