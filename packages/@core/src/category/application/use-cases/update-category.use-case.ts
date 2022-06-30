import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOuputMapper, CategoryOutput } from "../dto/category-output";
import { UseCase as DefaultUseCase } from "../../../@seedwork/application/use-case";

export namespace UpdateCategoryUseCase {
  export class UseCase implements DefaultUseCase<Input, CategoryOutput> {
    constructor(private categoryRepo: CategoryRepository.Repository) {}

    async execute(input: Input): Promise<CategoryOutput> {
      const entity = await this.categoryRepo.findById(input.id);
      entity.update({ name: input.name, description: input.description });

      if (input.is_active === true) {
        entity.activate();
      }
      if (input.is_active === false) {
        entity.deactivate();
      }
      await this.categoryRepo.update(entity);
      return CategoryOuputMapper.toOutput(entity);
    }
  }

  // DTOs
  export type Input = {
    id: string;
    name: string;
    description?: string;
    is_active?: boolean;
  };
}
