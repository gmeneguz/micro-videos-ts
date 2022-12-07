import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoryProviders } from './category.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategorySequelize } from '@fc/micro-videos/category/infra';

@Module({
  imports: [SequelizeModule.forFeature([CategorySequelize.CategoryModel])],
  controllers: [CategoriesController],
  providers: [
    ...Object.values(CategoryProviders.Repositories),
    ...Object.values(CategoryProviders.UseCases),
  ],
})
export class CategoriesModule {}
