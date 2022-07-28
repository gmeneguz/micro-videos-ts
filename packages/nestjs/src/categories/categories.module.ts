import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import {
  CreateCategoryUseCase,
  ListCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CategoryInMemoryRepository } from '@fc/micro-videos/category/infra';
import { CategoryRepository } from '@fc/micro-videos/category/domain/repository';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: 'CategoryRepository',
      useClass: CategoryInMemoryRepository,
    },
    {
      provide: CreateCategoryUseCase.UseCase,
      useFactory(categoryRepo: CategoryRepository.Repository) {
        return new CreateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository'],
    },
    {
      provide: ListCategoryUseCase.UseCase,
      useFactory(categoryRepo: CategoryRepository.Repository) {
        return new ListCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository'],
    },
  ],
})
export class CategoriesModule {}
