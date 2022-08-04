import { SortDirection } from '@fc/micro-videos/dist/@seedwork/repository/repository-contracts';
import {
  CreateCategoryUseCase,
  ListCategoryUseCase,
} from '@fc/micro-videos/dist/category/application';
import { CategoriesController } from '../categories.controller';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should create category', async () => {
    const expectedOutput: CreateCategoryUseCase.Output = {
      id: '8ee17fd3-447c-437c-9da6-61dabb0446ba',
      name: 'aaa',
      description: 'desc',
      is_active: true,
      created_at: new Date(),
    };
    const mockUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    };
    //@ts-expect-error
    controller['createUseCase'] = mockUseCase;

    const input: CreateCategoryDto = {
      name: 'aaa',
      description: 'desc',
      is_active: true,
    };

    const output = await controller.create(input);

    expect(mockUseCase.execute).toBeCalledWith(input);
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should update category', async () => {
    const id = '8ee17fd3-447c-437c-9da6-61dabb0446ba';
    const expectedOutput: CreateCategoryUseCase.Output = {
      id,
      name: 'aaa',
      description: 'desc',
      is_active: true,
      created_at: new Date(),
    };
    const mockUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    };
    //@ts-expect-error
    controller['updateUseCase'] = mockUseCase;

    const input: UpdateCategoryDto = {
      name: 'aaa22',
      description: 'desc',
      is_active: true,
    };

    const output = await controller.update(id, input);

    expect(mockUseCase.execute).toBeCalledWith({ id, ...input });
    expect(output).toStrictEqual(expectedOutput);
  });
  it('should get category', async () => {
    const id = '8ee17fd3-447c-437c-9da6-61dabb0446ba';
    const expectedOutput: CreateCategoryUseCase.Output = {
      id,
      name: 'aaa',
      description: 'desc',
      is_active: true,
      created_at: new Date(),
    };
    const mockUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error
    controller['getUseCase'] = mockUseCase;

    expect(controller.findOne(id)).toBeInstanceOf(Promise);

    const output = await controller.findOne(id);

    expect(mockUseCase.execute).toBeCalledWith({ id });
    expect(output).toStrictEqual(expectedOutput);
  });
  it('should list category', async () => {
    const id = '8ee17fd3-447c-437c-9da6-61dabb0446ba';
    const expectedOutput: ListCategoryUseCase.Output = {
      items: [
        {
          id,
          name: 'aaa',
          description: 'desc',
          is_active: true,
          created_at: new Date(),
        },
      ],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    };
    const mockUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error
    controller['listUseCase'] = mockUseCase;

    const searchParams = {
      page: 1,
      limit: 1,
      sort: 'name',
      sortDir: 'asc' as SortDirection,
      filter: 'test',
    };

    const output = await controller.search(searchParams);

    expect(mockUseCase.execute).toBeCalledWith(searchParams);
    expect(output).toStrictEqual(expectedOutput);
  });
  it('should delete category', async () => {
    const expectedOutput = undefined;
    const mockUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error
    controller['deleteUseCase'] = mockUseCase;

    const id = '8ee17fd3-447c-437c-9da6-61dabb0446ba';
    expect(controller.remove(id)).toBeInstanceOf(Promise);

    const output = await controller.remove(id);

    expect(mockUseCase.execute).toBeCalledWith({ id });
    expect(output).toStrictEqual(expectedOutput);
  });
});
