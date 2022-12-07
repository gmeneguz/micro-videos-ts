import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions,
} from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';

type CONFIG_DB_SCHEMA_TYPE = {
  DB_DIALECT: 'mysql' | 'sqlite';
  DB_HOST: string;
  DB_DATABASE?: string;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_PORT?: number;
  DB_LOGGING: boolean;
  DB_AUTO_LOAD_MODELS: boolean;
};

export type CONFIG_SCHEMA_TYPE = CONFIG_DB_SCHEMA_TYPE;

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<CONFIG_DB_SCHEMA_TYPE> = {
  DB_DIALECT: Joi.string().required().valid('mysql', 'sqlite'),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().when('DB_DIALECT', {
    is: 'sqlite',
    then: Joi.string().optional(),
    otherwise: Joi.string().required(),
  }),
  DB_USERNAME: Joi.string().when('DB_DIALECT', {
    is: 'sqlite',
    then: Joi.string().optional(),
    otherwise: Joi.string().required(),
  }),
  DB_PASSWORD: Joi.string().required().when('DB_DIALECT', {
    is: 'sqlite',
    then: Joi.string().optional(),
    otherwise: Joi.string().required(),
  }),
  DB_PORT: Joi.number().required().when('DB_DIALECT', {
    is: 'sqlite',
    then: Joi.number().optional(),
    otherwise: Joi.number().required(),
  }),
  DB_LOGGING: Joi.boolean().required(),
  DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
};

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    const { envFilePath, ...otherOptions } = options;
    const envFile = Array.isArray(options?.envFilePath)
      ? options.envFilePath
      : [options?.envFilePath];

    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...envFile,
        join(__dirname, `../envs/.${process.env.NODE_ENV}.env`),
        join(__dirname, '../envs/.env'),
      ],
      validationSchema: Joi.object({
        ...CONFIG_DB_SCHEMA,
      }),
      ...otherOptions,
    });
  }
}
