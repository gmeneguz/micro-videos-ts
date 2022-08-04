import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoryUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/dist/category/application';
import { CategoryRepository } from '@fc/micro-videos/dist/category/domain/repository';
import { CategoryInMemoryRepository } from '@fc/micro-videos/dist/category/infra';

export namespace CategoryProviders {
  export namespace Repositories {
    export const CategoryInMemory = {
      provide: 'CategoryRepository',
      useClass: CategoryInMemoryRepository,
    };
  }
  export namespace UseCases {
    export const CreateCategory = {
      provide: CreateCategoryUseCase.UseCase,
      useFactory(categoryRepo: CategoryRepository.Repository) {
        return new CreateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CategoryInMemory.provide],
    };
    export const UpdateCategory = {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory(categoryRepo: CategoryRepository.Repository) {
        return new UpdateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CategoryInMemory.provide],
    };
    export const DeleteCategory = {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory(categoryRepo: CategoryRepository.Repository) {
        return new DeleteCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CategoryInMemory.provide],
    };
    export const GetCategory = {
      provide: GetCategoryUseCase.UseCase,
      useFactory(categoryRepo: CategoryRepository.Repository) {
        return new GetCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CategoryInMemory.provide],
    };
    export const ListCategory = {
      provide: ListCategoryUseCase.UseCase,
      useFactory(categoryRepo: CategoryRepository.Repository) {
        return new ListCategoryUseCase.UseCase(categoryRepo);
      },
      inject: [Repositories.CategoryInMemory.provide],
    };
  }
}
