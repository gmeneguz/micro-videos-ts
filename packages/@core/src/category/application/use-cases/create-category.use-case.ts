import { Category } from "#category/domain/entities/category";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOuputMapper, CategoryOutput } from "../dto/category-output";
import { UseCase as DefaultUseCase } from "../../../@seedwork/application/use-case";

export namespace CreateCategoryUseCase {
  export class UseCase implements DefaultUseCase<Input, CategoryOutput> {
    constructor(private categoryRepo: CategoryRepository.Repository) {}

    async execute(input: Input): Promise<CategoryOutput> {
      const entity = new Category(input);
      await this.categoryRepo.insert(entity);
      return CategoryOuputMapper.toOutput(entity);
    }
  }

  // DTOs
  export type Input = {
    name: string;
    description?: string;
    is_active?: boolean;
  };
  export type Output = CategoryOutput;
}
