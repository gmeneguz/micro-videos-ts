import { ListCategoryUseCase } from '@fc/micro-videos/category/application';
import { SortDirection } from '@fc/micro-videos/dist/@seedwork/repository/repository-contracts';

export class SearchCategoryDto implements ListCategoryUseCase.Input {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: SortDirection;
  filter?: string;
}
