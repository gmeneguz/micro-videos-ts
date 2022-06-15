import Category from "../../domain/entities/category";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOuputMapper, CategoryOutput } from "../dto/category-output";
import { UseCase } from "../../../@seedwork/application/use-case";

export default class CreateCategoryUseCase
  implements UseCase<Input, CategoryOutput>
{
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
