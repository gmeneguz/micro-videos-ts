import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoryUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CategoryRepository } from '@fc/micro-videos/category/domain/repository';
import { CategoryInMemoryRepository } from '@fc/micro-videos/category/infra';
import { CategorySequelize } from '@fc/micro-videos/category/infra/db';

export namespace CategoryProviders {
  export namespace Repositories {
    export const CategoryInMemory = {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    };
    export const CategorySequelizeRepository = {
      provide: 'CategorySequelizeRepository',
      useFactory: () => {
        return new CategorySequelize.CategorySequelizeRepository(
          CategorySequelize.CategoryModel,
        );
      },
    };
    export const CategoryRepository = {
      provide: 'CategoryRepository',
      useExisting: 'CategorySequelizeRepository',
    };
  }

  export namespace UseCases {
    export const CreateCategory = {
      provide: CreateCategoryUseCase.UseCase,
      useFactory(categoryRepo: CategoryRepository.Repository) {
        return new CreateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CategoryRepository.provide],
    };
    export const UpdateCategory = {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory(categoryRepo: CategoryRepository.Repository) {
        return new UpdateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CategoryRepository.provide],
    };
    export const DeleteCategory = {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory(categoryRepo: CategoryRepository.Repository) {
        return new DeleteCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CategoryRepository.provide],
    };
    export const GetCategory = {
      provide: GetCategoryUseCase.UseCase,
      useFactory(categoryRepo: CategoryRepository.Repository) {
        return new GetCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CategoryRepository.provide],
    };
    export const ListCategory = {
      provide: ListCategoryUseCase.UseCase,
      useFactory(categoryRepo: CategoryRepository.Repository) {
        return new ListCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CategoryRepository.provide],
    };
  }
}
