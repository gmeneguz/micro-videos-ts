import { Test } from '@nestjs/testing';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from './database.module';
import { Sequelize } from 'sequelize-typescript';
import { getConnectionToken } from '@nestjs/sequelize';
describe('Database Module Unit Tests', () => {
  it('should be a sqlite connection', async () => {
    const module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          validationSchema: null,
          envFilePath: null,
          load: [
            () => ({
              DB_DIALECT: 'sqlite',
              DB_HOST: ':memory:',
              DB_LOGGING: false,
              DB_AUTO_LOAD_MODELS: true,
            }),
          ],
        }),
      ],
    }).compile();

    const app = module.createNestApplication();
    const conn = app.get<Sequelize>(getConnectionToken());
    expect(conn).toBeDefined();
    expect(conn.options.dialect).toBe('sqlite');
    expect(conn.options.host).toBe(':memory:');
    await conn.close();
  });
  it('should be a mysql connection', async () => {
    const module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          validationSchema: null,
          envFilePath: null,
          load: [
            () => ({
              DB_DIALECT: 'mysql',
              DB_HOST: 'localhost',
              DB_LOGGING: false,
              DB_AUTO_LOAD_MODELS: true,
              DB_DATABASE: 'test',
              DB_USERNAME: 'test',
              DB_PASSWORD: 'test',
            }),
          ],
        }),
      ],
    }).compile();

    const app = module.createNestApplication();
    const conn = app.get<Sequelize>(getConnectionToken());
    expect(conn).toBeDefined();
    expect(conn.options.dialect).toBe('mysql');
    expect(conn.options.host).toBe('localhost');
    expect(conn.options.database).toBe('test');
    expect(conn.options.username).toBe('test');
    expect(conn.options.password).toBe('test');
    await conn.close();
  });
});
