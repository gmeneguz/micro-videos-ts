import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoryProviders } from './category.providers';

@Module({
  controllers: [CategoriesController],
  providers: [
    ...Object.values(CategoryProviders.Repositories),
    ...Object.values(CategoryProviders.UseCases),
  ],
})
export class CategoriesModule {}
