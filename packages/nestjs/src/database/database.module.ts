import { CategorySequelize } from '@fc/micro-videos/category/infra';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONFIG_SCHEMA_TYPE } from 'src/config/config.module';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (config: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        const models = [CategorySequelize.CategoryModel];
        if (config.get('DB_DIALECT') === 'sqlite') {
          return {
            dialect: 'sqlite',
            host: config.get('DB_HOST'),
            models,
            autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
            logging: config.get('DB_LOGGING'),
          };
        } else {
          return {
            dialect: config.get('DB_DIALECT'),
            host: config.get('DB_HOST'),
            database: config.get('DB_DATABASE'),
            username: config.get('DB_USERNAME'),
            password: config.get('DB_PASSWORD'),
            port: config.get('DB_PORT'),
            models,
            autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
            logging: config.get('DB_LOGGING'),
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
