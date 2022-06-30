import { Category } from "#category/domain/entities/category";

export type CategoryOutput = {
  id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at: Date;
};

export class CategoryOuputMapper {
  static toOutput(entity: Category): CategoryOutput {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      created_at: entity.created_at,
      is_active: entity.is_active,
    };
  }
}
