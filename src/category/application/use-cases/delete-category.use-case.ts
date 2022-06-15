import { CategoryRepository } from "../../domain/repository/category.repository";
import { UseCase } from "../../../@seedwork/application/use-case";

export default class DeleteCategoryUseCase implements UseCase<Input, void> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<void> {
    await this.categoryRepo.delete(input.id);
  }
}

// DTOs
export type Input = {
  id: string;
};
