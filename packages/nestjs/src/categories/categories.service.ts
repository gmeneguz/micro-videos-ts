import {
  CreateCategoryUseCase,
  ListCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable({ scope: Scope.DEFAULT })
export class CategoriesService {
  @Inject(CreateCategoryUseCase.UseCase)
  private createUseCase: CreateCategoryUseCase.UseCase;

  @Inject(ListCategoryUseCase.UseCase)
  private listUseCase: ListCategoryUseCase.UseCase;

  create(input: CreateCategoryUseCase.Input) {
    return this.createUseCase.execute(input);
  }

  search(input: ListCategoryUseCase.Input) {
    return this.listUseCase.execute(input);
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
