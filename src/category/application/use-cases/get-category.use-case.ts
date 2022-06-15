import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOuputMapper, CategoryOutput } from "../dto/category-output";
import { UseCase } from "../../../@seedwork/application/use-case";

export default class GetCategoryUseCase
  implements UseCase<Input, CategoryOutput>
{
  constructor(private categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<CategoryOutput> {
    const entity = await this.categoryRepo.findById(input.id);
    return CategoryOuputMapper.toOutput(entity);
  }
}

// DTOs
export type Input = {
  id: string;
};
