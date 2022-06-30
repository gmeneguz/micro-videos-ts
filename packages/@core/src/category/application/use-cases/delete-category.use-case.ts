import { CategoryRepository } from "../../domain/repository/category.repository";
import { UseCase as DefaultUseCase } from "../../../@seedwork/application/use-case";

export namespace DeleteCategoryUseCase {
  export class UseCase implements DefaultUseCase<Input, void> {
    constructor(private categoryRepo: CategoryRepository.Repository) {}

    async execute(input: Input): Promise<void> {
      await this.categoryRepo.delete(input.id);
    }
  }

  // DTOs
  export type Input = {
    id: string;
  };
}
