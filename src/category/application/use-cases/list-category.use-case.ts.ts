import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOuputMapper, CategoryOutput } from "../dto/category-output";
import { UseCase } from "../../../@seedwork/application/use-case";
import { SearchInputDto } from "../../../@seedwork/application/dto/search-input.dto";
import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from "../../../@seedwork/application/dto/pagination-output";

export default class ListCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const params = new CategoryRepository.SearchParams(input);
    const result = await this.categoryRepo.search(params);
    return this.toOutput(result);
  }
  private toOutput(result: CategoryRepository.SearchResult): Output {
    return {
      items: result.items.map(CategoryOuputMapper.toOutput),
      ...PaginationOutputMapper.toPaginationOutput(result),
    };
  }
}

export type Input = SearchInputDto;
export type Output = PaginationOutputDto<CategoryOutput>;
