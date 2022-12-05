import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, CONFIG_SCHEMA_TYPE } from './config/config.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(__dirname, './envs/.test.env'),
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    // const r = app
    //   .get<ConfigService<CONFIG_SCHEMA_TYPE>>(ConfigService)
    //   .get('DB_DIALECT');
    // console.log(r)
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
